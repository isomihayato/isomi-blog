<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontController extends Controller
{
    public function article($id)
    {
        return Inertia::render('Article', [
            'id' => $id,
        ]);
    }
}
