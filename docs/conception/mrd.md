# MRD – OrdoLite

**USER** (

    user_id       : integer, PK
    first_name    : string(50), not null
    last_name     : string(50), not null
    email         : string(100), unique, not null
    password      : string, not null
    role          : string(20), not null, check in ('USER', 'ADMIN')
    created_at    : datetime, default current_datetime
    updated_at    : datetime, default current_datetime
)

**PRESCRIPTION** (

    prescription_id : integer, PK
    title           : string(100), null
    prescriber      : string(100), null
    notes           : text, null
    created_at      : datetime, default current_datetime
    updated_at      : datetime, default current_datetime
    user_id         : integer, FK → USER(user_id) ON DELETE CASCADE
)

**MEDICATION** (

    medication_id      : integer, PK
    name               : string(100), not null
    brand_name         : string(100), null
    short_description  : text, null
    form               : string(50), null
    base_dosage        : string(50), null
    expiration_date    : date, null
    created_at         : datetime, default current_datetime
    updated_at         : datetime, default current_datetime
)

**PRESCRIPTION_LINE** (

    line_id          : integer, PK
    start_date       : date, not null
    end_date         : date, null
    dose             : decimal, null
    unit             : string(20), null
    frequency_day    : integer, null
    instructions     : text, null
    status           : string(20), null, check in ('active', 'completed', 'paused')
    created_at       : datetime, default current_datetime
    updated_at       : datetime, default current_datetime
    prescription_id  : integer, FK → PRESCRIPTION(prescription_id) ON DELETE CASCADE
    medication_id    : integer, FK → MEDICATION(medication_id) ON DELETE SET NULL
)

**ATTACHMENT** (

    attachment_id     : integer, PK
    mime_type         : string(50), not null
    file_size_bytes   : integer, not null
    file_path         : text, not null
    sha256            : string(64), not null
    created_at        : datetime, default current_datetime
    prescription_id   : integer, FK → PRESCRIPTION(prescription_id) ON DELETE CASCADE
)

**NOTIFICATION** (

    notif_id     : integer, PK
    notif_type   : string(50), not null, check in ('medication_reminder', 'prescription_expiry', 'new_prescription')
    content      : text, not null
    created_at   : datetime, default current_datetime
    is_read      : boolean, default false
    user_id      : integer, FK → USER(user_id) ON DELETE CASCADE
)

**REFRESH_TOKEN** (

    token_id     : integer, PK
    created_at   : datetime, default current_datetime
    expires_at   : datetime, not null
    device_info  : string(100), null
    user_id      : integer, FK → USER(user_id) ON DELETE CASCADE
)

**RESET_PASSWORD** (

    reset_id     : integer, PK
    token        : string, not null, unique
    expires_at   : datetime, not null
    created_at   : datetime, default current_datetime
    is_used      : boolean, default false
    user_id      : integer, FK → USER(user_id) ON DELETE CASCADE
)
