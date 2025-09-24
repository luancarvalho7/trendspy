# Form Flow Mapping - Steps Until Profile Found

## Complete Form Flow Until Profile Discovery

### Step 1: Account Name (`account_name`)
- **Component**: `AccountNameForm`
- **Purpose**: Collect the account name for the user's monitoring account
- **Data Collected**: `accountName`
- **Next Step**: `social_network_type`

### Step 2: Social Network Type (`social_network_type`)
- **Component**: `SocialNetworkTypeForm`  
- **Purpose**: Determine if it's a personal brand or company account
- **Data Collected**: `socialNetworkType` ("Marca Pessoal" or "Empresa")
- **Next Step**: `instagram_handle`

### Step 3: Instagram Handle (`instagram_handle`) 🔍 **PROFILE LOOKUP HAPPENS HERE**
- **Component**: `InstagramHandleForm`
- **Purpose**: Collect Instagram username and fetch profile data
- **Data Collected**: 
  - `instagramHandle`
  - `userProfileMetrics` (from API response)
- **API Call**: 
  - **URL**: `https://webhook.workez.online/webhook/trends/lander/getUserProfile`
  - **Method**: POST
  - **Payload**: All form data + `instagramHandle`
- **Response Format**:
  ```json
  {
    "profilePicture": "https://s3.workez.online/trendspy/...",
    "bio": "User bio text...",
    "following": "2211",
    "followers": "1422", 
    "media": "21",
    "name": "luan",
    "username": "luan.oak",
    "userId": "17846859851562524",
    "success": true
  }
  ```
- **Loading State**: Shows "Buscando dados do perfil..."
- **Next Step**: `instagram_confirmation`

### Step 4: Instagram Profile Confirmation (`instagram_confirmation`) ✅ **PROFILE CONFIRMED HERE**
- **Component**: `InstagramConfirmationForm`
- **Purpose**: Display found profile and get user confirmation
- **Profile Display**:
  - Profile picture
  - Name and username (@handle)
  - Stats: Posts, Followers, Following (formatted with K/M)
  - Bio text (with line breaks preserved)
- **User Actions**:
  - **"Sim, esse é meu perfil"** → Continue to `has_website`
  - **"Não, quero alterar"** → Go back to `instagram_handle`
- **Error Handling**: If `success !== true`, shows error state with retry option
- **Data Collected**: `profileConfirmed: true`
- **Next Step**: `has_website`

## Summary

**Profile Discovery Flow:**
1. **Account Name** → Get monitoring account name
2. **Social Network Type** → Personal brand vs Company  
3. **Instagram Handle** → 🔍 **FETCH PROFILE DATA** (API call)
4. **Profile Confirmation** → ✅ **CONFIRM CORRECT PROFILE** (visual verification)

**Key Points:**
- Profile lookup happens at step 3 (`instagram_handle`)
- Profile confirmation happens at step 4 (`instagram_confirmation`) 
- API response includes all profile metadata (followers, posts, bio, etc.)
- Error handling for invalid usernames or API failures
- User can retry if wrong profile is found

**After Profile Confirmation:**
The form continues to collect additional information about website, niches, objectives, and monitoring preferences.