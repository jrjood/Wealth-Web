const getPrimaryLocation = (location: string) =>
  location.split(',')[0]?.trim() || location;

export const slugifyProjectPart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getProjectSlug = ({
  title,
  location,
}: {
  title: string;
  location: string;
}) => {
  const titleSlug = slugifyProjectPart(title);
  const locationSlug = slugifyProjectPart(getPrimaryLocation(location));

  return [titleSlug, locationSlug].filter(Boolean).join('-');
};
