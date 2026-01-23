#!/bin/bash

# 1. Login Page
# Create catch-all directory
mkdir -p src/app/\(public\)/login/\[\[...rest\]\]
# Move existing page into it
mv src/app/\(public\)/login/page.tsx src/app/\(public\)/login/\[\[...rest\]\]/page.tsx

# 2. Signup Page
# Create catch-all directory
mkdir -p src/app/\(public\)/signup/\[\[...rest\]\]
# Move existing page into it
mv src/app/\(public\)/signup/page.tsx src/app/\(public\)/signup/\[\[...rest\]\]/page.tsx

echo "✅ Auth routes moved to catch-all structure."
