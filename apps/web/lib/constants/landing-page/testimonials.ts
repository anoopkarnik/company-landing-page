import { TestimonialProps, TestimonialSectionProps } from "@/lib/ts-types/landing";

export const testimonials: TestimonialProps[] = [
    {
      image: "./anoop.jpg",
      name: "Anoop Karnik Dasika",
      position: "CEO of Cyberdyne Systems",
      comment: "This is the best boilerplate for micro SaaS monerepo code out there!",
    },
    {
      image: "./batman.jpg",
      name: "Batman",
      position: "CEO of Gotham",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to save gotham by creating a surveillance AI.",
    },
    {
      image: "./einstein.jpg",
      name: "Albert Einstein",
      position: "CEO of Princeton",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to help me solve the equation of the universe.",
    },
    {
      image: "./newton.jpg",
      name: "Issac Newton",
      position: "CEO of Cambridge",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to help me understand the thousands of laws of motion insteadf of just 3.",
    },
    {
      image: "./buddha.jpeg",
      name: "Gautum Buddha",
      position: "CEO of Bodh Gaya",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to help me understand the meaning of life.",
    },
    {
      image: "./ironman.jpeg",
      name: "Iron Man",
      position: "CEO of Stark Industries",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to help me save the world from Thanos.",
    },
  ];

export const testimonialSection: TestimonialSectionProps = {
    heading: "Discover Why People Love This SaaS Landing Page Code",
    description: `These are some of the testimonials that we have received from our clients. `,
    testimonials
}