# e-Permit and Business Licensing System — API Reference

## 5. REST API Design


### 5.1 Conventions

- Base URL: http://localhost:3000/api — all bodies are JSON.
- Resource-oriented plural URIs; HTTP verbs express the action (GET read, POST create, PATCH update, DELETE remove).
- Protected routes require the header Authorization: Bearer <access_token>.
- Errors share one shape: {"statusCode": 400, "message": "...", "error": "Bad Request"}.


### 5.2 Endpoint Summary

| Method | Endpoint | JWT | Success | Purpose |
|---|---|---|---|---|
| POST | /api/auth/register | No | 201 | Register a user |
| POST | /api/auth/login | No | 200 | Log in, receive JWT |
| GET | /api/auth/me | Yes | 200 | Current user |
| GET | /api/permit-types | Yes | 200 | List PermitType |
| GET | /api/permit-types/count | Yes | 200 | Count PermitType |
| GET | /api/permit-types/:id | Yes | 200 | Get one PermitType |
| POST | /api/permit-types | Yes | 201 | Create PermitType |
| PATCH | /api/permit-types/:id | Yes | 200 | Update PermitType |
| DELETE | /api/permit-types/:id | Yes | 200 | Delete PermitType |
| GET | /api/applications | Yes | 200 | List Application |
| GET | /api/applications/count | Yes | 200 | Count Application |
| GET | /api/applications/:id | Yes | 200 | Get one Application |
| POST | /api/applications | Yes | 201 | Create Application |
| PATCH | /api/applications/:id | Yes | 200 | Update Application |
| DELETE | /api/applications/:id | Yes | 200 | Delete Application |
| GET | /api/application-documents | Yes | 200 | List ApplicationDocument |
| GET | /api/application-documents/count | Yes | 200 | Count ApplicationDocument |
| GET | /api/application-documents/:id | Yes | 200 | Get one ApplicationDocument |
| POST | /api/application-documents | Yes | 201 | Create ApplicationDocument |
| PATCH | /api/application-documents/:id | Yes | 200 | Update ApplicationDocument |
| DELETE | /api/application-documents/:id | Yes | 200 | Delete ApplicationDocument |
| GET | /api/payments | Yes | 200 | List Payment |
| GET | /api/payments/count | Yes | 200 | Count Payment |
| GET | /api/payments/:id | Yes | 200 | Get one Payment |
| POST | /api/payments | Yes | 201 | Create Payment |
| PATCH | /api/payments/:id | Yes | 200 | Update Payment |
| DELETE | /api/payments/:id | Yes | 200 | Delete Payment |

Total: 27 endpoints (methods used: GET, POST, PATCH, DELETE).


### 5.3 Status Codes

| Code | Meaning in this API |
|---|---|
| 200 OK | Successful read, update, delete, login. |
| 201 Created | Resource or user created. |
| 400 Bad Request | Validation failed, or a referenced foreign-key record does not exist. |
| 401 Unauthorized | Missing, invalid or expired token; wrong login credentials. |
| 404 Not Found | No record with the requested id. |
| 409 Conflict | Duplicate e-mail on register, or deleting a record that is still referenced. |


### 5.4 Authentication Endpoints


#### POST /api/auth/register  →  201 Created

```
Request
{
  "email": "demo@example.com",
  "fullName": "Demo User",
  "password": "Password123"
}

Response
{
  "id": 1,
  "email": "demo@example.com",
  "fullName": "Demo User",
  "role": "user"
}
```

Errors: 400 (invalid e-mail or password shorter than 8 characters), 409 (e-mail already registered).


#### POST /api/auth/login  →  200 OK

```
Request
{
  "email": "demo@example.com",
  "password": "Password123"
}

Response
{
  "access_token": "<JWT>",
  "token_type": "Bearer"
}
```

Errors: 400 (invalid input), 401 (wrong e-mail or password).


#### GET /api/auth/me  →  200 OK   (header: Authorization: Bearer <JWT>)

```
{
  "id": 1,
  "email": "demo@example.com",
  "fullName": "Demo User",
  "role": "user",
  "createdAt": "2026-12-01T09:00:00.000Z"
}
```

Errors: 401 (missing, invalid or expired token).


### 5.5 Resource Endpoints

All resource endpoints require the Bearer token. The examples below are the exact shapes returned by the implementation. Decimal columns are returned by MySQL as strings in read responses; relations are expanded one level in GET responses and shown as {"id": n} in create/update responses.


#### PermitType  —  /api/permit-types

| Field | Validation rules | DB column |
|---|---|---|
| permitname | required, string, not empty | PermitName |
| description | optional, string | Description |
| fee | required, number, max 2 decimals, min 0 | Fee |

```
POST /api/permit-types   → 201
Request
{
  "permitname": "Sample PermitName",
  "description": "Sample Description",
  "fee": 100.0
}

Response
{
  "id": 1,
  "permitname": "Sample PermitName",
  "description": "Sample Description",
  "fee": 100.0,
  "createdAt": "2026-12-01T09:00:00.000Z",
  "updatedAt": "2026-12-01T09:00:00.000Z"
}
```

```
GET /api/permit-types   → 200  (array)
[
  {
    "id": 1,
    "permitname": "Sample PermitName",
    "description": "Sample Description",
    "fee": "100.00",
    "createdAt": "2026-12-01T09:00:00.000Z",
    "updatedAt": "2026-12-01T09:00:00.000Z"
  }
]
```

```
PATCH /api/permit-types/1   → 200
Request
{
  "permitname": "Sample PermitName (Updated)"
}
```

```
DELETE /api/permit-types/1   → 200
{
  "deleted": true,
  "id": 1
}
```

Other responses: GET /api/permit-types/count → 200 {"total": 1}; GET/PATCH/DELETE /api/permit-types/:id with an unknown id → 404 {"message": "PermitType not found"}; invalid body → 400; unknown foreign-key id → 400; deleting a record that is still referenced → 409.


#### Application  —  /api/applications

| Field | Validation rules | DB column |
|---|---|---|
| businessname | required, string, not empty | BusinessName |
| status | optional, one of pending,approved,rejected | Status |
| submittedat | optional, ISO-8601 date string | SubmittedAt |
| userid (→ User) | required, integer, min 1 | UserID |
| permittypeid (→ PermitType) | required, integer, min 1 | PermitTypeID |

```
POST /api/applications   → 201
Request
{
  "businessname": "Sample BusinessName",
  "status": "pending",
  "submittedat": "2026-12-01T09:00:00.000Z",
  "userid": 1,
  "permittypeid": 1
}

Response
{
  "id": 1,
  "businessname": "Sample BusinessName",
  "status": "pending",
  "submittedat": "2026-12-01T09:00:00.000Z",
  "user": {
    "id": 1
  },
  "permittype": {
    "id": 1
  },
  "createdAt": "2026-12-01T09:00:00.000Z",
  "updatedAt": "2026-12-01T09:00:00.000Z"
}
```

```
GET /api/applications   → 200  (array)
[
  {
    "id": 1,
    "businessname": "Sample BusinessName",
    "status": "pending",
    "submittedat": "2026-12-01T09:00:00.000Z",
    "user": {
      "id": 1,
      "fullName": "Demo User",
      "email": "demo@example.com",
      "role": "user",
      "createdAt": "2026-12-01T09:00:00.000Z",
      "updatedAt": "2026-12-01T09:00:00.000Z"
    },
    "permittype": {
      "id": 1,
      "permitname": "Sample PermitName",
      "description": "Sample Description",
      "fee": 100.0,
      "createdAt": "2026-12-01T09:00:00.000Z",
      "updatedAt": "2026-12-01T09:00:00.000Z"
    },
    "createdAt": "2026-12-01T09:00:00.000Z",
    "updatedAt": "2026-12-01T09:00:00.000Z"
  }
]
```

```
PATCH /api/applications/1   → 200
Request
{
  "status": "approved"
}
```

```
DELETE /api/applications/1   → 200
{
  "deleted": true,
  "id": 1
}
```

Other responses: GET /api/applications/count → 200 {"total": 1}; GET/PATCH/DELETE /api/applications/:id with an unknown id → 404 {"message": "Application not found"}; invalid body → 400; unknown foreign-key id → 400; deleting a record that is still referenced → 409.


#### ApplicationDocument  —  /api/application-documents

| Field | Validation rules | DB column |
|---|---|---|
| filename | required, string, not empty | FileName |
| filepath | required, string, not empty | FilePath |
| uploadedat | optional, ISO-8601 date string | UploadedAt |
| applicationid (→ Application) | required, integer, min 1 | ApplicationID |

```
POST /api/application-documents   → 201
Request
{
  "filename": "Sample FileName",
  "filepath": "Sample FilePath",
  "uploadedat": "2026-12-01T09:00:00.000Z",
  "applicationid": 1
}

Response
{
  "id": 1,
  "filename": "Sample FileName",
  "filepath": "Sample FilePath",
  "uploadedat": "2026-12-01T09:00:00.000Z",
  "application": {
    "id": 1
  },
  "createdAt": "2026-12-01T09:00:00.000Z",
  "updatedAt": "2026-12-01T09:00:00.000Z"
}
```

```
GET /api/application-documents   → 200  (array)
[
  {
    "id": 1,
    "filename": "Sample FileName",
    "filepath": "Sample FilePath",
    "uploadedat": "2026-12-01T09:00:00.000Z",
    "application": {
      "id": 1,
      "businessname": "Sample BusinessName",
      "status": "pending",
      "submittedat": "2026-12-01T09:00:00.000Z",
      "user": {
        "id": 1,
        "fullName": "Demo User",
        "email": "demo@example.com",
        "role": "user",
        "createdAt": "2026-12-01T09:00:00.000Z",
        "updatedAt": "2026-12-01T09:00:00.000Z"
      },
      "permittype": {
        "id": 1,
        "permitname": "Sample PermitName",
        "description": "Sample Description",
        "fee": 100.0,
        "createdAt": "2026-12-01T09:00:00.000Z",
        "updatedAt": "2026-12-01T09:00:00.000Z"
      },
      "createdAt": "2026-12-01T09:00:00.000Z",
      "updatedAt": "2026-12-01T09:00:00.000Z"
    },
    "createdAt": "2026-12-01T09:00:00.000Z",
    "updatedAt": "2026-12-01T09:00:00.000Z"
  }
]
```

```
PATCH /api/application-documents/1   → 200
Request
{
  "filename": "Sample FileName (Updated)"
}
```

```
DELETE /api/application-documents/1   → 200
{
  "deleted": true,
  "id": 1
}
```

Other responses: GET /api/application-documents/count → 200 {"total": 1}; GET/PATCH/DELETE /api/application-documents/:id with an unknown id → 404 {"message": "ApplicationDocument not found"}; invalid body → 400; unknown foreign-key id → 400; deleting a record that is still referenced → 409.


#### Payment  —  /api/payments

| Field | Validation rules | DB column |
|---|---|---|
| amount | required, number, max 2 decimals, min 0 | Amount |
| paymentmethod | required, string, not empty | PaymentMethod |
| paidat | optional, ISO-8601 date string | PaidAt |
| applicationid (→ Application) | required, integer, min 1 | ApplicationID |

```
POST /api/payments   → 201
Request
{
  "amount": 100.0,
  "paymentmethod": "Sample PaymentMethod",
  "paidat": "2026-12-01T09:00:00.000Z",
  "applicationid": 1
}

Response
{
  "id": 1,
  "amount": 100.0,
  "paymentmethod": "Sample PaymentMethod",
  "paidat": "2026-12-01T09:00:00.000Z",
  "application": {
    "id": 1
  },
  "createdAt": "2026-12-01T09:00:00.000Z",
  "updatedAt": "2026-12-01T09:00:00.000Z"
}
```

```
GET /api/payments   → 200  (array)
[
  {
    "id": 1,
    "amount": "100.00",
    "paymentmethod": "Sample PaymentMethod",
    "paidat": "2026-12-01T09:00:00.000Z",
    "application": {
      "id": 1,
      "businessname": "Sample BusinessName",
      "status": "pending",
      "submittedat": "2026-12-01T09:00:00.000Z",
      "user": {
        "id": 1,
        "fullName": "Demo User",
        "email": "demo@example.com",
        "role": "user",
        "createdAt": "2026-12-01T09:00:00.000Z",
        "updatedAt": "2026-12-01T09:00:00.000Z"
      },
      "permittype": {
        "id": 1,
        "permitname": "Sample PermitName",
        "description": "Sample Description",
        "fee": 100.0,
        "createdAt": "2026-12-01T09:00:00.000Z",
        "updatedAt": "2026-12-01T09:00:00.000Z"
      },
      "createdAt": "2026-12-01T09:00:00.000Z",
      "updatedAt": "2026-12-01T09:00:00.000Z"
    },
    "createdAt": "2026-12-01T09:00:00.000Z",
    "updatedAt": "2026-12-01T09:00:00.000Z"
  }
]
```

```
PATCH /api/payments/1   → 200
Request
{
  "paymentmethod": "Sample PaymentMethod (Updated)"
}
```

```
DELETE /api/payments/1   → 200
{
  "deleted": true,
  "id": 1
}
```

Other responses: GET /api/payments/count → 200 {"total": 1}; GET/PATCH/DELETE /api/payments/:id with an unknown id → 404 {"message": "Payment not found"}; invalid body → 400; unknown foreign-key id → 400; deleting a record that is still referenced → 409.
