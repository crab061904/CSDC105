const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    markdown: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    sanitizedHtml: {
      type: String,
      required: true,
    },
    image: {
      type: Buffer,  // Store image as Binary Data (Buffer)
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Pre-save hook to generate slug and sanitize markdown
blogSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const blog = mongoose.model('blogs', blogSchema);
module.exports = blog;
