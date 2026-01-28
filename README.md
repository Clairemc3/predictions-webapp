In development

## Features

### Soft Deletes with Cascading

This application implements a custom `CascadesSoftDeletes` trait that automatically cascades soft deletes to related models.

When a season member is excluded (soft deleted), their predictions are also soft deleted. If the member is restored later, their predictions are automatically restored as well.

See `code-guidelines.md` for implementation details.