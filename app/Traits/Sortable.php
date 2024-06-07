<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait Sortable
{
    /**
     * @param \Illuminate\Http\Request $request
     * @param \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder $builder
     * @param string $defaultSortBy
     * @param string $defaultSortOrder
     */
    protected function sort(Request $request, $builder, $defaultSortBy = 'created_at', $defaultSortOrder = 'desc')
    {
        $sortBy = $request->input('sortBy', $defaultSortBy);
        $sortOrder = $request->input('sortOrder', $defaultSortOrder);

        if ($sortBy) $builder->orderByRaw("{$sortBy} IS NULL, {$sortBy} {$sortOrder}");

        return [$sortBy, $sortOrder];
    }
}
