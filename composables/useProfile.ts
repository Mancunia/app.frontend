import { getProfile, updateProfile } from "~/services/user/profile";

// E.164: + followed by country code (1-3 digits) then subscriber number, total 7–15 digits
const E164_REGEX = /^\+[1-9]\d{6,14}$/;

type ProfileForm = {
  username: string;
  bio: string;
  dp: string;
  whatsappNumber: string;
};

export const useProfile = () => {
  const store = useAuthStore();
  const { generateSignedUrl, uploadFile } = useAWS(USER_ROLES.USER);
  const { addSuccess, addError } = useNotification();
  const { checkForOldFile } = useUtils();

  const fetchingProfile = ref(false);
  const loading = ref(false);
  const uploadingDp = ref(false);
  const phoneError = ref<string | null>(null);

  // Snapshot of values after the last successful load / save —
  // used to build a changed-fields-only PATCH payload.
  let initial: ProfileForm = {
    username: "",
    bio: "",
    dp: "",
    whatsappNumber: "",
  };

  const form = reactive<ProfileForm>({
    username: "",
    bio: "",
    dp: "",
    whatsappNumber: "",
  });

  const dpPreview = ref<string | null>(null);

  // ── Fetch latest profile from server ──────────────────────────────
  const initProfile = async () => {
    fetchingProfile.value = true;
    try {
      const res = await getProfile();
      if (res) {
        const d = res;
        form.username = d.username ?? "";
        form.bio = d.bio ?? "";
        form.dp = d.dp ?? "";
        form.whatsappNumber = d.whatsappNumber ?? "";
        dpPreview.value = d.dp ? checkForOldFile(d.dp) : null;
        // Sync store with fresh server data
        store.setUser({ ...store.getUser, ...d });
        // Snapshot for diff
        initial = { ...form };
        phoneError.value = null;
      }
    } catch {
      addError("Could not load profile");
    } finally {
      fetchingProfile.value = false;
    }
  };

  // ── Avatar upload ─────────────────────────────────────────────────
  const handleDpChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      dpPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    uploadingDp.value = true;
    try {
      const signedUrl = await generateSignedUrl(file);
      if (!signedUrl) throw new Error("Failed to get upload URL");

      const uploaded = await uploadFile(file, signedUrl);
      if (!uploaded) throw new Error("Failed to upload image");

      form.dp = uploaded;
    } catch {
      addError("Could not upload profile picture");
      dpPreview.value = initial.dp ? checkForOldFile(initial.dp) : null;
    } finally {
      uploadingDp.value = false;
    }
  };

  // ── Phone validation ──────────────────────────────────────────────
  const validatePhone = (): boolean => {
    const val = form.whatsappNumber;
    if (!val || val === "") {
      phoneError.value = null;
      return true;
    }
    if (!E164_REGEX.test(val)) {
      phoneError.value = "Enter a valid number with country code, e.g. +233241234567";
      return false;
    }
    phoneError.value = null;
    return true;
  };

  watch(() => form.whatsappNumber, validatePhone);

  // ── Build changed-fields-only payload ────────────────────────────
  const buildPayload = (): Partial<ProfileForm> => {
    const payload: Partial<ProfileForm> = {};
    if (form.username !== initial.username) payload.username = form.username;
    if (form.bio !== initial.bio) payload.bio = form.bio;
    if (form.dp !== initial.dp) payload.dp = form.dp;
    if (form.whatsappNumber !== initial.whatsappNumber)
      payload.whatsappNumber = form.whatsappNumber;
    return payload;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const submit = async (): Promise<boolean> => {
    if (!validatePhone()) return false;

    const payload = buildPayload();
    if (Object.keys(payload).length === 0) {
      addError("No changes to save");
      return false;
    }

    loading.value = true;
    try {
      const res = await updateProfile(payload);
      if (res) {
        store.setUser({ ...store.getUser, ...res });
        // Refresh snapshot so subsequent edits diff correctly
        initial = { ...form };
        addSuccess("Profile updated");
        return true;
      }
    } catch {
      addError("Could not update profile");
    } finally {
      loading.value = false;
    }
    return false;
  };

  return {
    form,
    fetchingProfile,
    loading,
    uploadingDp,
    dpPreview,
    phoneError,
    initProfile,
    handleDpChange,
    submit,
  };
};
