# Code Guidelines

## Soft Deletes and Cascading

### CascadesSoftDeletes Trait

The `CascadesSoftDeletes` trait provides automatic cascading of soft deletes to related models.

**Location**: `app/Models/Traits/CascadesSoftDeletes.php`

**Usage**:
```php
use App\Models\Traits\CascadesSoftDeletes;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentModel extends Model
{
    use SoftDeletes, CascadesSoftDeletes;

    protected array $cascadeDeletes = ['childRelation', 'anotherRelation'];

    public function childRelation()
    {
        return $this->hasMany(ChildModel::class);
    }
}
```

**How it works**:
- When a model is soft deleted (not force deleted), all related models specified in `$cascadeDeletes` will also be soft deleted
- When a model is restored, all related models will be automatically restored as well
- This only applies to soft deletes - force deletes bypass this behavior

**Example in this application**:
The `SeasonMember` model uses this trait to cascade soft deletes to its `answers` relation. When a season member is excluded (soft deleted), all their predictions (answers) are also soft deleted. If the member is restored, their predictions are restored too.
