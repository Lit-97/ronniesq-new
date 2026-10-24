import {
  getHomepageTestimonialsContent,
} from "@/lib/homepage-testimonials";

import TestimonialsClient from "./TestimonialsClient";

export default async function Testimonials() {
  const content =
    await getHomepageTestimonialsContent();

  return (
    <TestimonialsClient
      content={content}
    />
  );
}