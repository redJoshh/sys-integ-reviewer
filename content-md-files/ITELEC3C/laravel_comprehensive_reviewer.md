# Laravel Comprehensive Reviewer (Modules 1–6)

**Instructor's Note:** Welcome to your comprehensive Laravel architecture and implementation reviewer! This exam covers Foundations, Folder Structure, MVC, Routing, Blade, Middleware, Migrations, Eloquent ORM, and Form Validation.

## Grading Breakdown

- **Part I: Multiple Choice (Items 1–25)** – 1 point each (25 points)
- **Part II: True or False (Items 26–40)** – 1 point each (15 points)
- **Part III: Folder Structure Fill-in-the-Blank (Items 41–50)** – 1 point each (10 points)
- **Part IV: Artisan CLI & Syntax Fill-in-the-Blank (Items 51–60)** – 1 point each (10 points)
- **Part V: Core File Multi-Blank Completion (Items 61–65)** – 5 points each / 1 pt per blank (25 points)
- **Part VI: Predicting the Code Output (Items 66–75)** – 1.5 points each (15 points)
- **TOTAL:** **75 Items / 100 Points**

---

## Part I: Multiple Choice (Application & Purpose of Syntax and Logic)

_Directions: Choose the best answer for each question. Correct answers are indicated with a checkmark (✅)._ **(1 point each — 25 points total)**

**1. Who created the Laravel framework in 2011, designing it around the philosophy of "elegant and expressive syntax"?**

- [ ] A. Rasmus Lerdorf
- [x] B. Taylor Otwell ✅
- [ ] C. Fabien Potencier
- [ ] D. Evan You

**2. In Laravel’s MVC architecture, which component acts as the "Heart of the application" (or the "Waiter" in the restaurant analogy), containing business logic and bridging data and presentation?**

- [ ] A. Model
- [ ] B. View
- [x] C. Controller ✅
- [ ] D. Migration

**3. What is the minimum required PHP version specified in the study guides to run a modern Laravel 11 environment?**

- [ ] A. `PHP >= 7.4`
- [ ] B. `PHP >= 8.0`
- [x] C. `PHP >= 8.1` ✅
- [ ] D. `PHP >= 8.3`

**4. Which built-in Laravel middleware protects routes against brute-force attacks and ensures stability by limiting the number of requests a user can make in a given timeframe?**

- [ ] A. `auth`
- [ ] B. `VerifyCsrfToken`
- [x] C. `throttle` ✅
- [ ] D. `guest`

**5. Why is using `Product::findOrFail($id)` preferred over `Product::find($id)` when processing form updates in a Controller?**

- [ ] A. `find($id)` automatically deletes the record if it is missing.
- [x] B. `findOrFail($id)` throws a `ModelNotFoundException` (rendering a clean HTTP 404 response) instead of returning `null` and causing a fatal error when calling `update()`. ✅
- [ ] C. `findOrFail($id)` bypasses mass assignment protection automatically.
- [ ] D. `find($id)` only works with the Query Builder, not Eloquent ORM.

**6. What is the primary purpose of adding the `bail` rule to a validation constraint list (e.g., `'name' => 'bail|required|min:5|unique:products'`)?**

- [ ] A. It redirects the user to the login page if validation fails.
- [ ] B. It ignores all validation errors and saves the record anyway.
- [x] C. It stops evaluating remaining rules on that specific attribute immediately after its first validation failure, saving server/database resources. ✅
- [ ] D. It deletes the session data upon validation failure.

**7. When comparing `Eloquent ORM` (`Product::find(1)`) against the `Fluent Query Builder` (`DB::table('products')->find(1)`), what is the primary difference in their return structure?**

- [ ] A. Eloquent returns a raw JSON string; Query Builder returns an array.
- [x] B. Eloquent returns a hydrated Model instance (with Carbon date casting); Query Builder returns a generic `stdClass` object with raw scalar strings. ✅
- [ ] C. Query Builder automatically casts dates to Carbon instances; Eloquent does not.
- [ ] D. Eloquent uses less memory than Query Builder for tens of thousands of rows.

**8. What is the role of the `$fillable` property inside an Eloquent Model class?**

- [ ] A. It defines a "block-list" of columns that cannot be updated.
- [x] B. It defines an "allow-list" of database column names safe for mass assignment via `create()` or `update()`. ✅
- [ ] C. It specifies which fields are required during form validation.
- [ ] D. It lists the foreign keys connected to the model.

**9. What happens under the hood when `$request->validate()` fails during a standard web form submission?**

- [ ] A. It returns `false` and the controller continues executing the next line of code.
- [ ] B. It throws a `MassAssignmentException` and crashes the server.
- [x] C. It throws a `ValidationException`, halts controller execution, and redirects the client back (HTTP 302) with `$errors` and `old()` input flashed to the session. ✅
- [ ] D. It deletes the database table associated with the model.

**10. Which Blade directive is used to provide localized, inline validation feedback adjacent to a specific form input field?**

- [ ] A. `@if($errors->any())`
- [x] B. `@error('field_name') ... @enderror` ✅
- [ ] C. `@csrf`
- [ ] D. `@validate('field_name')`

**11. Which Blade helper function is placed inside an HTML input's `value` attribute to repopulate previously typed user data after a validation redirect?**

- [ ] A. `session('field_name')`
- [ ] B. `keep('field_name')`
- [x] C. `old('field_name')` ✅
- [ ] D. `back('field_name')`

**12. How do you customize validation error messages globally across the entire application rather than inline inside a single controller method?**

- [ ] A. By editing `.env`
- [x] B. By running `php artisan lang:publish` and modifying `lang/en/validation.php` ✅
- [ ] C. By editing `bootstrap/app.php`
- [ ] D. By adding `$messages` to the Eloquent Model

**13. When updating an existing product record, why do we append `,$product->id` to the unique validation rule (`'unique:products,name,' . $product->id`)?**

- [ ] A. To force the database to assign a new primary key ID to the product.
- [x] B. To instruct the unique validator to ignore the current record's primary key, preventing false-positive duplicate errors if the user leaves the name unchanged. ✅
- [ ] C. To verify that the user owns the product before updating.
- [ ] D. To soft-delete the old product record before creating a new one.

**14. What is the difference between a Database Migration and a Database Seeder?**

- [ ] A. Migrations populate dummy data; Seeders create tables.
- [x] B. Migrations define and version-control the structural schema (tables/columns); Seeders populate tables with foundational or test data records. ✅
- [ ] C. Migrations can only be run once; Seeders run automatically on every HTTP request.
- [ ] D. There is no difference; they are aliases for the same tool.

**15. Which PHP library is utilized inside Laravel Model Factories (`definition()` method) to generate bulk, randomized dummy data like names, paragraphs, and dates?**

- [ ] A. Carbon
- [x] B. Faker (`fake()`) ✅
- [ ] C. Blueprint
- [ ] D. Composer

**16. When implementing Soft Deletes on a resource, what happens in the database when you execute `$product->delete()`?**

- [ ] A. The row is permanently purged from physical storage.
- [x] B. The `deleted_at` timestamp column is set to the current date/time, archiving the record without dropping the row. ✅
- [ ] C. The record is moved to a separate `trashed_products` table.
- [ ] D. The `updated_at` column is set to `null`.

**17. Which Eloquent method is used to permanently purge a soft-deleted record from physical database storage?**

- [ ] A. `$product->delete()`
- [ ] B. `$product->destroy()`
- [x] C. `$product->forceDelete()` ✅
- [ ] D. `$product->purge()`

**18. Which Eloquent query scope retrieves ONLY soft-deleted records (`deleted_at IS NOT NULL`) while excluding active records?**

- [ ] A. `Product::withTrashed()`
- [x] B. `Product::onlyTrashed()` ✅
- [ ] C. `Product::archived()`
- [ ] D. `Product::deleted()`

**19. In a multi-server deployment environment, what is the purpose of running `php artisan migrate --isolated`?**

- [ ] A. It runs migrations without connecting to the database.
- [x] B. It acquires an atomic lock via the cache driver (e.g., Redis) so only one server node executes migrations at a time, preventing race conditions. ✅
- [ ] C. It isolates failed migrations and deletes their files.
- [ ] D. It runs migrations only on local SQLite databases.

**20. What is the key difference between `php artisan migrate:refresh` and `php artisan migrate:fresh`?**

- [ ] A. `migrate:fresh` preserves all database data, while `migrate:refresh` deletes it.
- [x] B. `migrate:refresh` runs every migration's `down()` method sequentially before migrating; `migrate:fresh` bypasses `down()` methods entirely and drops all tables directly. ✅
- [ ] C. `migrate:fresh` only runs new migrations; `migrate:refresh` runs seeders.
- [ ] D. `migrate:refresh` is safe for production; `migrate:fresh` is not.

**21. In an Eloquent Model, if the `products` table stores a `user_id` foreign key referencing the `users` table, what is the standard production relationship method to define the child-to-parent connection?**

- [ ] A. `$this->hasMany(User::class)`
- [x] B. `$this->belongsTo(User::class, 'user_id', 'id')` ✅
- [ ] C. `$this->belongsToMany(User::class)`
- [ ] D. `$this->morphTo(User::class)`

**22. How does "After Middleware" work in Laravel's circular request lifecycle?**

- [ ] A. It runs before the router matches the URL.
- [x] B. It captures the response returned from `$next($request)` after the controller finishes, allowing modifications (like adding headers or logging) before sending it to the user. ✅
- [ ] C. It runs in a background queue 5 minutes after the user closes the browser.
- [ ] D. It only executes if an exception is thrown in the controller.

**23. When passing a custom parameter (such as an `admin` role) to a route middleware in `routes/web.php`, what syntax is used?**

- [ ] A. `->middleware('checkrole=admin')`
- [x] B. `->middleware('checkrole:admin')` ✅
- [ ] C. `->middleware('checkrole->admin')`
- [ ] D. `->middleware(['checkrole', 'admin'])`

**24. Why is it considered a critical security flaw to rely solely on client-side validation (HTML5 `required` attributes or JavaScript)?**

- [ ] A. Because JavaScript slows down the web browser.
- [x] B. Because client-side checks run in an untrusted environment and can be easily bypassed using browser developer consoles, Postman, or cURL. ✅
- [ ] C. Because HTML5 attributes do not work in Blade files.
- [ ] D. Because client-side validation causes HTTP 419 errors.

**25. When storing a newly created product in a Controller, why should you assign `'user_id' => Auth::id()` on the server instead of accepting `$request->user_id` from a hidden form input?**

- [ ] A. `Auth::id()` runs faster than `$request->user_id`.
- [x] B. Accepting `$request->user_id` from the form is vulnerable to foreign key spoofing, where a malicious user can inject any user ID. ✅
- [ ] C. Hidden form inputs are stripped out by the `VerifyCsrfToken` middleware.
- [ ] D. Eloquent does not allow integers from `$request` objects.

---

## Part II: True or False (Syntax & Logic)

_Directions: Determine whether each statement is True or False. Correct answers are marked with a checkmark (✅)._ **(1 point each — 15 points total)**

**26. Blade templates introduce a heavy runtime performance penalty because Laravel must parse the Blade syntax from scratch on every single page load.**

- [ ] True
- [x] False ✅ _(Blade files are compiled into plain PHP code and cached, resulting in zero performance overhead)._

**27. You should directly edit files inside the `vendor/` directory whenever you want to customize how a third-party Composer package works.**

- [ ] True
- [x] False ✅ _(The `vendor` folder is managed by Composer; changes will be overwritten during updates)._

**28. In Laravel 11+, the traditional `app/Http/Kernel.php` file has been removed, and global middleware registration now takes place in `bootstrap/app.php`.**

- [x] True ✅
- [ ] False

**29. By default, if you do not include the `bail` rule, Laravel evaluates all specified validation rules on an attribute sequentially even if the first rule fails.**

- [x] True ✅
- [ ] False

**30. If an incoming stateless JSON API request fails `$request->validate()`, Laravel returns an HTTP 302 redirect back to the previous page.**

- [ ] True
- [x] False ✅ _(For JSON API requests, Laravel bypasses redirects and returns an HTTP 422 Unprocessable Entity JSON response)._

**31. Adding `$table->softDeletes();` inside a migration file is sufficient by itself to make `$product->delete()` perform a soft delete; no changes are needed in the Model class.**

- [ ] True
- [x] False ✅ _(You must also import and use the `SoftDeletes` trait inside the Eloquent Model class)._

**32. The `@csrf` Blade directive protects your application against SQL Injection attacks.**

- [ ] True
- [x] False ✅ _(`@csrf` protects against Cross-Site Request Forgery session-spoofing; Eloquent's parameter binding protects against SQL Injection)._

**33. In an Eloquent Model, `$fillable` acts as an "allow-list" of mass-assignable attributes, whereas `$guarded` acts as a "block-list".**

- [x] True ✅
- [ ] False

**34. Setting `protected $guarded = [];` (an empty array) on a Model and passing `$request->all()` into `Product::create()` is a recommended security best practice.**

- [ ] True
- [x] False ✅ _(An empty `$guarded` array disables mass-assignment boundaries completely, leaving the model vulnerable to malicious payload injection)._

**35. Running `php artisan migrate --pretend` executes a dry run that prints the raw SQL queries to the terminal without actually modifying the database.**

- [x] True ✅
- [ ] False

**36. By default, standard Eloquent queries (such as `Product::all()` or `Product::latest()->paginate(10)`) automatically exclude records that have been soft-deleted.**

- [x] True ✅
- [ ] False

**37. If an HTML `<input>` tag has an `id="product_name"` attribute but is missing the `name="product_name"` attribute, `$request->validate(['product_name' => 'required'])` will continuously fail.**

- [x] True ✅
- [ ] False

**38. Global Middleware only runs on routes that explicitly call `->middleware()` inside `routes/web.php`.**

- [ ] True
- [x] False ✅ _(Global Middleware runs on every single HTTP request entering the application)._

**39. By convention, an Eloquent Model uses a singular PascalCase class name (e.g., `Product`), which automatically maps to a plural snake_case database table name (e.g., `products`).**

- [x] True ✅
- [ ] False

**40. If a custom middleware's `handle()` method redirects an unauthenticated user to a login route that is also protected by the exact same middleware, it will cause a "Too many redirects" infinite loop.**

- [x] True ✅
- [ ] False

---

## Part III: Folder Structure Fill-in-the-Blank

_Directions: Identify the exact Laravel root directory or file described in each item._ **(1 point each — 10 points total)**

41. The `____________________` directory is the core logic housing of the application, containing Models, Controllers, and Middleware.
42. In Laravel 11+, the `____________________` file serves as the new configuration nerve center for framework bootstrapping and global middleware registration, replacing `Kernel.php`.
43. The `____________________` directory is the centralized location for all application configuration setting files (such as database, mail, and cache settings).
44. The `____________________` directory houses database schema blueprints (migrations), model factories, and seeders.
45. The `____________________` directory is the web server's entry point, containing `index.php` and publicly accessible assets like images, compiled CSS, and JavaScript.
46. The `____________________` directory houses uncompiled frontend assets and all Blade template files (`views/`).
47. The `____________________` directory contains definitions for application entry points, including `web.php` for browser requests and `console.php` for CLI commands.
48. The `____________________` directory contains framework-generated files, including application logs, file sessions, caches, and compiled Blade templates.
49. The `____________________` directory contains all third-party libraries and dependencies managed and installed by Composer.
50. Specifically within the `routes/` folder, the `____________________` file is responsible for defining stateful browser routes that receive session state and CSRF protection.

> ### 🔑 Answer Key (Part III: Folder Structure)
>
> - **41.** `app` (or `app/`)
> - **42.** `bootstrap/app.php`
> - **43.** `config` (or `config/`)
> - **44.** `database` (or `database/`)
> - **45.** `public` (or `public/`)
> - **46.** `resources` (or `resources/`)
> - **47.** `routes` (or `routes/`)
> - **48.** `storage` (or `storage/`)
> - **49.** `vendor` (or `vendor/`)
> - **50.** `web.php` (or `routes/web.php`)

---

## Part IV: Artisan CLI & Syntax Fill-in-the-Blank

_Directions: Fill in the missing CLI command, flag, or syntax element._ **(1 point each — 10 points total)**

51. To initialize a brand-new Laravel project named `my-app` using Composer, you run: `composer ____________________ laravel/laravel my-app`
52. To start Laravel's built-in local development server, you run the Artisan command: `php artisan ____________________`
53. To generate an Eloquent model named `Product` and automatically generate its corresponding database migration file at the same time, you run: `php artisan make:model Product ____________________`
54. To generate a custom middleware class named `CheckAge` inside `app/Http/Middleware`, you run: `php artisan ____________________ CheckAge`
55. In a long-lived application with hundreds of historical migrations, running `php artisan ____________________` squashes/compresses migration history into a single SQL file inside `database/schema/`.
56. To revert (undo) the migrations executed in the very last batch by running their `down()` methods, you run: `php artisan ____________________`
57. To override batch numbers and roll back the last **2** migration files sequentially, you run: `php artisan migrate:rollback ____________________`
58. To execute a specific seeder class named `ProductSeeder` without running the entire `DatabaseSeeder`, you run: `php artisan db:seed ____________________=ProductSeeder`
59. In a Blade view, after calling `Product::latest()->paginate(10)` in the controller, you render the responsive pagination buttons using: `{{ $products->____________________ }}`
60. If your legacy database table is named `tbl_items` instead of following Laravel's plural convention for an `Item` model, you override it inside the Model class using: `protected $____________________ = 'tbl_items';`

> ### 🔑 Answer Key (Part IV: CLI & Syntax)
>
> - **51.** `create-project`
> - **52.** `serve`
> - **53.** `-m` (or `--migration`)
> - **54.** `make:middleware`
> - **55.** `schema:dump`
> - **56.** `migrate:rollback`
> - **57.** `--step=2`
> - **58.** `--class`
> - **59.** `links()`
> - **60.** `table`

---

## Part V: Core File Multi-Blank Completion

_Directions: Each item below represents a core file in the Laravel ecosystem (`Migration`, `Model`, `Middleware`, `web.php`, and `Controller`). Fill in the **5 blanks** (`[a]` through `[e]`) in each file to complete the code._ **(5 points per item / 1 point per blank — 35 points total)**

### 61. Database Migration File (`database/migrations/..._create_products_table.php`)

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function ___[a]___(): void {
        Schema::___[b]___('products', function (Blueprint $table) {
            $table->___[c]___(); // Primary auto-incrementing ID key
            $table->string('name');
            $table->longText('description');
            $table->___[d]___(); // Adds deleted_at column for archiving
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::___[e]___('products');
    }
};
```

### 62. Eloquent Model File (`app/Models/Product.php`)

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\___[a]___;   // Base class every model extends
use Illuminate\Database\Eloquent\___[b]___;   // Trait that enables archiving
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model {
    use SoftDeletes;

    // Allow-list for mass assignment
    protected $___[c]___ = ['name', 'description', 'user_id'];

    public function user(): BelongsTo {
        return $this->___[d]___(___[e]___::class, 'user_id', 'id');
    }
}
```

### 63. Custom Middleware & Alias Registration (`CheckRole.php` & `bootstrap/app.php`)

```php
<?php
// File 1: app/Http/Middleware/CheckRole.php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class CheckRole {
    public function ___[a]___(Request $request, Closure $next, string $___[b]___) {
        if (! $request->user() || $request->user()->role !== $role) {
            return ___[c]___('home');
        }
        return $___[d]___($request);
    }
}

// File 2: bootstrap/app.php (Alias registration snippet)
// Lets routes use it by name, e.g. ->middleware('role:admin')
->withMiddleware(function (Middleware $middleware) {
    $middleware->___[e]___(['role' => CheckRole::class]);
})
```

### 64. Routes & Blade Form View (`routes/web.php` & `create.blade.php`)

```php
// Part A: routes/web.php
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::___[a]___(['auth'])->___[b]___(function () {
    Route::post('/products/store', [ProductController::class, 'store'])->___[c]___('products.store');
});
```

```html
<!-- Part B: resources/views/admin/products/create.blade.php -->
<form action="{{ route('products.store') }}" method="POST">
  ___[d]___
  <input type="text" name="name" value="{{ ___[e]___('name') }}" />
  <button type="submit">Submit</button>
</form>
```

### 65. Controller File: Full CRUD (`app/Http/Controllers/ProductController.php`)

_Each part below is worth 5 points (1 point per blank)._

#### 65A. Create & Read (`index`, `create`, `store`, `show`)

```php
<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {
    public function index() {
        // Newest first, 10 records per page with page links
        $products = Product::latest()->___[a]___(10);
        return view('products.index', compact('products'));
    }

    public function create() {
        return view('products.create');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            // Rejects a name that already exists in the products table (table,column)
            'name' => 'required|max:255|___[b]___:products,name',
            'description' => 'required|min:10',
        ]);

        // Uses the User hasMany relationship so user_id is filled automatically
        $request->user()->___[c]___()->___[d]___($validated);

        return redirect()->route('products.index')->with('success', 'Product created!');
    }

    public function show($id) {
        // Locate record or throw HTTP 404
        $product = Product::___[e]___($id);
        return view('products.show', compact('product'));
    }
}
```

#### 65B. Edit & Update (`edit`, `update`)

```php
    public function edit($id) {
        $product = Product::findOrFail($id);
        // Return the Blade form, pre-filled with the existing record
        return ___[a]___('products.edit', compact('product'));
    }

    public function update(Request $request, $id) {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            // Stop checking this field after the first failed rule
            'name' => '___[b]___|required|max:255',
            // Minimum of 10 characters
            'description' => 'required|___[c]___:10',
        ]);

        // Persist updated attributes to database
        $product->___[d]___($validated);

        // Redirect with a one-time session message
        return redirect()->route('products.index')->___[e]___('success', 'Product updated!');
    }
```

#### 65C. Delete, Archive & Restore (`destroy`, `archived`, `restore`, `forceDelete`)

```php
    public function destroy($id) {
        $product = Product::findOrFail($id);
        // With the SoftDeletes trait, this only sets deleted_at (archive)
        $product->___[a]___();

        return redirect()->route('products.index')->with('success', 'Product archived!');
    }

    public function archived() {
        // Query only the soft-deleted (archived) rows
        $products = Product::___[b]___()->paginate(10);
        return view('products.archived', compact('products'));
    }

    public function restore($id) {
        $product = Product::onlyTrashed()->findOrFail($id);
        // Clears deleted_at so the record is active again
        $product->___[c]___();

        return redirect()->route('products.archived')->with('success', 'Product restored!');
    }

    public function forceDelete($id) {
        // Search both active and archived rows
        $product = Product::___[d]___()->findOrFail($id);
        // Real SQL DELETE, no undo
        $product->___[e]___();

        return redirect()->route('products.archived')->with('success', 'Product permanently deleted!');
    }
```

> ### 🔑 Answer Key (Part V: Core File Multi-Blank Completion)
>
> - **61. Migration:** `[a]` `up` | `[b]` `create` | `[c]` `id` | `[d]` `softDeletes` | `[e]` `dropIfExists`
> - **62. Model:** `[a]` `Model` | `[b]` `SoftDeletes` | `[c]` `fillable` | `[d]` `belongsTo` | `[e]` `User`
> - **63. Middleware:** `[a]` `handle` | `[b]` `role` | `[c]` `redirect` | `[d]` `next` | `[e]` `alias`
> - **64. Routes & Blade:** `[a]` `middleware` | `[b]` `group` | `[c]` `name` | `[d]` `@csrf` | `[e]` `old`
> - **65A. Create & Read:** `[a]` `paginate` | `[b]` `unique` | `[c]` `products` | `[d]` `create` | `[e]` `findOrFail`
> - **65B. Edit & Update:** `[a]` `view` | `[b]` `bail` | `[c]` `min` | `[d]` `update` | `[e]` `with`
> - **65C. Delete, Archive & Restore:** `[a]` `delete` | `[b]` `onlyTrashed` | `[c]` `restore` | `[d]` `withTrashed` | `[e]` `forceDelete`
>
> **Why (for the reviewer notes):**
>
> - **63:** `alias` registers a short name so routes can write `->middleware('role:admin')`. Anything after the colon is passed to `handle()` as the extra `$role` parameter. A global middleware (`append`) runs on every request and can't receive per-route parameters, so a role check belongs in an alias. The `! $request->user() ||` guard prevents a crash when a guest reaches the route.
> - **65A (`unique`):** `unique:products,name` is a database check on `table,column`. It fails if another row already has that value. Note that soft-deleted (archived) rows are still in the table, so an archived product's name still counts as taken. To ignore archived rows, use `Rule::unique('products', 'name')->whereNull('deleted_at')`.
> - **65B (`update`):** the same `unique` rule would reject the record's own unchanged name when editing. The fix is `Rule::unique('products', 'name')->ignore($id)`.
> - **65B:** `bail` stops validating a field after its first failure. `with('success', ...)` flashes a one-time session message.
> - **65C:** `delete()` becomes a soft delete only because of the `SoftDeletes` trait. `restore()` and `forceDelete()` take a raw `$id` because route-model binding excludes archived rows.

---

## Part VI: Predicting the Code Output

_Directions: Analyze the provided code snippets and execution scenarios, then predict the exact output, exception, HTTP status code, or behavior._ **(1.5 points each — 15 points total)**

**66. Scenario: Missing CSRF Directive**

```html
<form action="{{ route('products.store') }}" method="POST">
  <input type="text" name="name" value="Gaming Laptop" />
  <button type="submit">Save</button>
</form>
```

_Question:_ When a user clicks "Save" to submit this POST form in a standard Laravel web route, what exact **HTTP status code and default error message screen** will Laravel return?

**67. Scenario: Validation with the `bail` Rule**

```php
$request->validate([
    'title' => 'bail|required|min:10|max:20|unique:products'
]);
```

_Question:_ If a user submits `'title' => 'Hi'`, which specific rule fails, and **will Laravel execute the database query for `unique:products`?** Why or why not?

**68. Scenario: Missing `fillable` Property**

```php
// In App\Models\Product.php
class Product extends Model {
    // No $fillable or $guarded properties defined
}

// In ProductController.php
Product::create($request->all());
```

_Question:_ What exact **Exception** will Laravel throw when `Product::create($request->all())` is executed?

**69. Scenario: Eloquent vs. Query Builder Date Formatting**

```php
$product = DB::table('products')->where('id', 1)->first();
echo $product->created_at->diffForHumans();
```

_Question:_ Predict the outcome of running this code. Will it output `"5 minutes ago"` or fail? Explain why.

**70. Scenario: Soft Delete Query Filtering**

_Setup:_ The `products` table has **5 rows** with `user_id = 1`. Two (2) of those rows have a timestamp in their `deleted_at` column, while three (3) have `deleted_at = NULL`. (`Product` uses `SoftDeletes`).

```php
$trashedCount = Product::onlyTrashed()->where('user_id', 1)->count();
$activeCount  = Product::where('user_id', 1)->count();
$totalCount   = Product::withTrashed()->where('user_id', 1)->count();
```

_Question:_ What are the numeric values of `$trashedCount`, `$activeCount`, and `$totalCount`?

**71. Scenario: Migration Batch Rollback**

_Setup:_ `Batch 1` executed 3 migrations (`users`, `categories`, `tags`). Later, `Batch 2` executed 1 migration (`products`).

```bash
php artisan migrate:rollback
```

_Question:_ Which table(s) will be dropped when this command is executed, and which table(s) will remain untouched?

**72. Scenario: Middleware Execution Missing `$next($request)`**

```php
public function handle(Request $request, Closure $next) {
    if ($request->input('age') < 18) {
        return abort(403);
    }
    // Nothing else below this line
}
```

_Question:_ Predict what happens first if a user submits `age = 16`, and second if a user submits `age = 25`.

**73. Scenario: `find()` vs `findOrFail()` on Missing ID**

```php
// Database only contains Product IDs 1 through 10.
public function update(Request $request, $id) {
    $product = Product::find($id);
    $product->update(['name' => 'Updated Name']);
}
```

_Question:_ If a client sends a POST request to `/products/update/999`, what exact **PHP error** occurs? How would changing `find($id)` to `findOrFail($id)` change the output?

**74. Scenario: Inline Validation Error Blade Rendering**

```php
// Controller:
$request->validate(
    ['name' => 'required|min:3'],
    ['name.min' => 'Product name must be three characters and above.']
);
```

```html
<!-- Blade View: -->
@error('name')
<span class="text-danger">{{ $message }}</span>
@enderror
```

_Question:_ If the user submits `'name' => 'TV'`, what exact HTML and text will be rendered by the Blade snippet upon redirect?

**75. Scenario: Missing HTML `name` Attribute**

```html
<form action="{{ route('products.store') }}" method="POST">
  @csrf
  <input type="text" id="product_title" value="Mechanical Keyboard" />
  <button type="submit">Submit</button>
</form>
```

```php
// Controller:
$request->validate(['product_title' => 'required']);
```

_Question:_ Even though `"Mechanical Keyboard"` is typed inside the input box, what happens when the form is submitted to the controller? Why?

> ### 🔑 Answer Key (Part VI: Predicting the Code Output)
>
> - **66.** **HTTP 419 Page Expired**. Because `@csrf` is omitted, the hidden `_token` field is missing, causing the `VerifyCsrfToken` middleware to reject the POST request.
> - **67.** The **`min:10`** rule fails (since `'Hi'` is only 2 characters). **No**, Laravel will **not** execute the `unique:products` query because the `bail` rule halts evaluation on that attribute immediately upon the first failure (`min:10`).
> - **68.** `Illuminate\Database\Eloquent\MassAssignmentException`. Eloquent blocks bulk creation/updates unless target attributes are declared in `$fillable`.
> - **69.** It will **fail with a fatal PHP error** (`Call to a member function diffForHumans() on string`). `DB::table()` uses the Query Builder, which returns a generic `stdClass` object where `created_at` is a raw string, not an Eloquent-hydrated `Carbon` instance.
> - **70.** `$trashedCount = 2`, `$activeCount = 3`, and `$totalCount = 5`.
> - **71.** Only the **`products` table** (Batch 2) will be dropped via its `down()` method. The **`users`, `categories`, and `tags` tables** (Batch 1) remain completely untouched.
> - **72.** If `age = 16`: Laravel throws an HTTP response exception and displays a **403 Forbidden** error page. If `age = 25`: The `if` block is skipped, and because `return $next($request);` is missing, the request is never passed to the controller—resulting in a blank/null response or error.
> - **73.** Using `find(999)` returns `null`, causing a **Fatal PHP Error: `Call to a member function update() on null`**. Changing it to `findOrFail(999)` catches the missing record and returns a clean **HTTP 404 Not Found** response before `update()` is ever reached.
> - **74.** It renders: `<span class="text-danger">Product name must be three characters and above.</span>`. The `$message` variable automatically captures the custom override for `name.min`.
> - **75.** **Validation fails continuously on the `required` rule** and redirects back with an error. Web browsers key HTTP POST payloads using the HTML `name` attribute, not `id`. Without `name="product_title"`, no value is sent in the request payload.
