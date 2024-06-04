import { faker } from "@faker-js/faker";

export const defaultProfiles = [
  {
    name: "Mia Hwang",
    email: "mia.hwang@gmail.com",
    image: "/avatar/avatar-default-1.svg",
    bio: "Mother who ate and left no crumbs",
  },
  {
    name: "Alex Nguyen",
    email: "alex.ng@gmail.com",
    image: "/avatar/avatar-default-2.svg",
    bio: "🦄⭐️",
  },
  {
    name: "Just Drew",
    email: "just.drew@gmail.com",
    image: "/avatar/avatar-default-3.svg",
    bio: "Trust fund, 6'5, blue eyes",
  },
];

const generateProfiles = () => {
  const profiles = Array(5)
    .fill(1)
    .map((value, index) => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      image: `/avatar/avatar-${index + 1}.svg`,
    }));

  return profiles;
};

export const AVATAR_FALLBACK =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88/ZfPQAI/ANY/TnuUAAAAABJRU5ErkJggg==";

export const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN;
export const allProfiles = generateProfiles();
