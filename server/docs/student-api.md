# Student API Documentation

## Endpoints

### Get All Students
`GET /api/students`

Retrieves a paginated list of students with their related data (grades, classes, and badges).

#### Query Parameters

| Parameter  | Type    | Description | Example |
|------------|---------|-------------|---------|
| page       | number  | Page number (default: 1) | `?page=2` |
| limit      | number  | Items per page (default: 10) | `?limit=20` |
| name       | string  | Filter by student name (case-insensitive) | `?name=john` |
| email      | string  | Filter by email (case-insensitive) | `?email=john@example.com` |
| minGrade   | number  | Filter by minimum average grade | `?minGrade=75` |
| maxGrade   | number  | Filter by maximum average grade | `?maxGrade=100` |
| sortBy     | string  | Field to sort by (default: name) | `?sortBy=averageGrade` |
| order      | string  | Sort order: 'asc' or 'desc' (default: asc) | `?order=desc` |
| fields     | string  | Comma-separated list of fields to include | `?fields=name,email,grades` |

#### Response Format

```json
{
    "students": [{
        "_id": "string",
        "name": "string",
        "email": "string",
        "grades": [...],
        "classes": [...],
        "badges": [...],
        "gradesCount": "number",
        "classesCount": "number",
        "badgesCount": "number",
        "averageGrade": "number"
    }],
    "pagination": {
        "currentPage": "number",
        "totalPages": "number",
        "totalItems": "number",
        "itemsPerPage": "number",
        "hasNextPage": "boolean",
        "hasPrevPage": "boolean"
    },
    "filters": {
        "name": "string|null",
        "email": "string|null",
        "minGrade": "number|null",
        "maxGrade": "number|null"
    },
    "sorting": {
        "field": "string",
        "order": "string"
    },
    "fields": ["string"]
}
```

### Get Student by ID
`GET /api/students/:id`

Retrieves a single student's complete profile with related data.

#### Response Format

```json
{
    "_id": "string",
    "name": "string",
    "email": "string",
    "grades": [...],
    "classes": [...],
    "badges": [...],
    "gradesCount": "number",
    "classesCount": "number",
    "badgesCount": "number",
    "averageGrade": "number"
}
```

## Performance Optimizations

1. **Data Population**
   - Related data (grades, classes, badges) is fetched in a single query
   - Computed fields for counts and averages
   - Efficient MongoDB aggregation pipeline

2. **Pagination**
   - Configurable page size
   - Metadata for navigation
   - Optimized query performance

3. **Filtering & Sorting**
   - Flexible search by name or email
   - Grade range filtering
   - Dynamic sorting by any field
   - Case-insensitive string matching

4. **Field Selection**
   - Selective data retrieval
   - Reduced response size
   - Bandwidth optimization

5. **Caching**
   - In-memory caching with 5-minute TTL
   - Cache keys based on query parameters
   - Automatic cache invalidation
   - Reduced database load

## Security

- Password field is always excluded from responses
- Role-based access control
- Authentication required for all endpoints
- Input validation and sanitization

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (invalid parameters)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error