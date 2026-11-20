export const MOCK_IDENTITIES = {
  admin: {
    id: "adm-01",
    name: "Administrator Alfary",
    role: "ADMIN" as const,
  },
  mentor: {
    id: "mnt-01",
    name: "Dr. Hendra Gunawan, M.Si.",
    role: "MENTOR" as const,
  },
} as const;

export const ACTIVE_MOCK_MENTOR = MOCK_IDENTITIES.mentor;
