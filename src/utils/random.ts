const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// RandomString generates a random string of length n
export function randomString(length: number) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// RandomInt generates a random integer between min and max
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// RandomOwner generates a random owner name
export function randomOwner() {
  return randomString(6);
}

// RandomMoney generates a random amount of money
export function RandomMoney() {
  return randomInt(0, 1000);
}

// RandomEmail generates a random email
export function randomEmail() {
  return randomString(6) + "@email.com";
}
