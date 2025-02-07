function getUserAvatarTextPlaceholder(displayName: string) {
  return displayName
    .split(" ")
    .map((x) => x.at(0))
    .filter(Boolean)
    .join("");
}

export default getUserAvatarTextPlaceholder;
