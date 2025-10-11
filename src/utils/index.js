/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
const mapToDBModel = ({
  id,
  title,
  tags,
  body,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  tags,
  body,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapToDBModel };
