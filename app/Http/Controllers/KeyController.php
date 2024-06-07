<?php

namespace App\Http\Controllers;

use App\Exceptions\MyException;
use App\Facades\Message;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use App\Models\Key;
use App\Models\Property;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Glitchbl\Image;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class KeyController extends Controller
{
    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Property  $property
     * @param  \App\Models\Key|null  $key
     */
    protected function validateForm(Request $request, Property $property, Key $key = null)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'identifier' => 'required|integer',
            'number_keys' => 'required|integer',
            'number_vigiks' => 'required|integer',
            'number_bips' => 'required|integer',
            'picture' => 'nullable|mimes:jpg,jpeg,png,gif',
            'crop' => 'required|array',
            'crop.x' => 'required|integer',
            'crop.y' => 'required|integer',
            'crop.height' => 'required|integer',
            'crop.width' => 'required|integer',
        ]);

        $validator->after(function ($validator) use ($request, $property, $key) {
            if (Key::whereRelation('property.site', 'id', $property->site->id)->whereIdentifier($request->identifier)->where('id', '!=', $key->id ?? 0)->count()) {
                $validator->errors()->add('identifier', 'Cet identifiant est déjà utilisé');
            }
        });

        $validator->validate();
    }

    /**
     * @param  \App\Models\Key  $key
     * @return string
     */
    protected function createQRCode(Key $key)
    {
        if ($media = $key->getMedia('qrcode')) $media->delete();

        $fname = Str::slug("{$key->id}-qrcode-{$key->name}-" . Str::random(6)) . '.png';

        Storage::put("medias/{$fname}", '');

        $frame = imagecreate(111, 140);
        imagecolorallocate($frame, 255, 255, 255);
        imagepng($frame, Storage::path("medias/{$fname}"), 6);

        $qrCodeFname = uniqid() . '.png';
        Storage::put("medias/{$qrCodeFname}", '');

        (new QRCode(new QROptions(['scale' => 3])))->render(route('histories.create', compact('key')), Storage::path("medias/{$qrCodeFname}"));

        $image = new Image(Storage::path("medias/{$fname}"));
        $image->addImage(new Image(Storage::path("medias/{$qrCodeFname}")), 0, -5, ['', 'center']);
         $image->addText(resource_path('fonts/helvetica.ttf'), $key->identifier, 0, 7, ['bottom', 'center'], 20, [0, 0, 0]);
        $image->save();

        $key->media()->create([
            'path' => $fname,
        ]);
    }

    /**
     * @param  \App\Models\Key $key
     * @param  \Illuminate\Http\UploadedFile $picture
     * @param  \Illuminate\Http\Request $request
     */
    protected function storePictureFromForm(Key $key, UploadedFile $picture, Request $request)
    {
        $this->deletePicture($key);

        $fname = Str::slug("{$key->id}-picture-{$key->name}-" . uniqid()) . '.jpg';

        $picture->storeAs('medias', $fname);

        $image = new Image(Storage::path("medias/{$fname}"));
        $image->crop($request->crop['width'], $request->crop['height'], $request->crop['x'], $request->crop['y']);
        $image->resize(1080, 1080);
        $image->save(null, Image::JPG);

        $key->media()->create(['path' => $fname]);
    }

    /**
     * @param \App\Models\Key
     * @return void
     */
    protected function deletePicture(Key $key)
    {
        foreach ($key->media as $media) {
            if (Str::is("*picture*", $media->path)) {
                $media->delete();
            }
        }
    }

    /**
     * @param \App\Models\Key
     * @return void
     */
    protected function checkKeyIsNotOut(Key $key)
    {
        if ($key->latestHistory->is_out ?? false) {
            throw new MyException("Impossible de modifier un trousseau sorti.");
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\Response
     */
    public function create(Property $property)
    {
        Gate::authorize('manage-properties', $property);

        return inertia('Keys/Create', compact('property'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Models\Property  $property
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Property $property, Request $request)
    {
        Gate::authorize('manage-properties', $property);

        $this->validateForm($request, $property);

        $keyLimit = $property->site->key_limit;

        if (!is_null($keyLimit)) {
            if ($property->site->nb_keys + 1 > $keyLimit) {
                Message::warning("Vous avez dépassé votre limite de trousseaux.");
                return redirect()->back()->withInput();
            }
        }

        $identifiers = Key::whereRelation('property.site', 'id', $property->site->id)->pluck('identifier')->sort();
        $identifier = 0;

        for ($i = 1; $i < 99999; $i++) {
            if (!$identifiers->containsStrict($i)) {
                $identifier = $i;
                break;
            }
        }

        $request->merge(compact('identifier'));

        $key = $property->keys()->create($request->only(
            'name',
            'identifier',
            'number_keys',
            'number_vigiks',
            'number_bips',
        ));

        $this->createQRCode($key);
        if ($request->picture) $this->storePictureFromForm($key, $request->picture, $request);

        Message::success("Le trousseau <strong>{$key->name}</strong> a bien été ajouté.");

        return redirect()->route('properties.show', compact('property'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function show(Key $key)
    {
        Gate::authorize('manage-properties', $key->property);

        $key->load('histories.user', 'property', 'latestHistory.alert', 'notes.user');

        return inertia('Keys/Show', ['_key' => $key]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function edit(Key $key)
    {
        Gate::authorize('manage-properties', $key->property);

        $this->checkKeyIsNotOut($key);

        return inertia('Keys/Edit', [
            'property' => $key->property,
            '_key' => $key,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Key $key)
    {
        Gate::authorize('manage-properties', $key->property);

        $this->checkKeyIsNotOut($key);

        $this->validateForm($request, $key->property, $key);

        $oldIdentifier = $key->identifier;
        $key->update($request->only(
            'name',
            'identifier',
            'number_keys',
            'number_vigiks',
            'number_bips',
        ));

        if ($oldIdentifier != $key->identifier) $this->createQRCode($key);
        if ($request->picture) $this->storePictureFromForm($key, $request->picture, $request);

        Message::success("Le trousseau <strong>{$key->name}</strong> a bien été modifié.");

        return redirect()->route('properties.show', ['property' => $key->property]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function destroy(Key $key)
    {
        Gate::authorize('manage-properties', $key->property);

        $this->checkKeyIsNotOut($key);

        $key->delete();

        Message::success("Le trousseau <strong>{$key->name}</strong> a bien été supprimé.");

        return redirect()->route('properties.show', ['property' => $key->property]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function find(Request $request)
    {
        Gate::authorize('manage-properties');

        $key = Key::whereRelation('property.site', 'id', Auth::user()->site->id)->whereIdentifier($request->id)->first();

        if (!$key) throw ValidationException::withMessages(['id' => "Aucun trousseau n'a été trouvé"]);

        return redirect()->route('keys.show', compact('key'));
    }

    /**
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function qrcode(Key $key)
    {
        Gate::authorize('manage-properties');

	//$this->createQRCode($key);

        $media = $key->getMedia('qrcode');

        return Storage::download("medias/{$media->path}");
    }
}
