import { Mail, Github, Twitter } from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the CivicVibe team.",
};

export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-h1 text-secondary-900">Get in Touch</h1>
            <p className="text-body-lg text-secondary-600">
              Have questions, suggestions, or want to contribute? We&apos;d love
              to hear from you.
            </p>
          </div>

          <div className="space-y-6">
            <ContactCard
              icon={<Mail className="h-6 w-6" />}
              title="Email Us"
              description="For general inquiries, partnerships, or support"
              action={
                <a
                  href="mailto:hello@civicvibe.org"
                  className="text-primary-600 hover:text-primary-700"
                >
                  hello@civicvibe.org
                </a>
              }
            />

            <ContactCard
              icon={<Github className="h-6 w-6" />}
              title="GitHub"
              description="Report issues, submit PRs, or explore our code"
              action={
                <a
                  href="https://github.com/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  github.com/example
                </a>
              }
            />

            <ContactCard
              icon={<Twitter className="h-6 w-6" />}
              title="Twitter / X"
              description="Follow us for updates and civic tech news"
              action={
                <a
                  href="https://twitter.com/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  @example
                </a>
              }
            />
          </div>

          <div className="mt-12 rounded-xl bg-primary-50 p-8 text-center">
            <h2 className="mb-2 text-h3 text-secondary-900">
              Want to Contribute?
            </h2>
            <p className="mb-4 text-secondary-600">
              CivicVibe is open source. Whether it&apos;s writing articles,
              contributing code, or sharing your government tech experience, we
              welcome your contributions.
            </p>
            <a
              href="https://github.com/example/civicvibe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              <Github className="mr-2 h-5 w-5" />
              Contribute on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-secondary-200 bg-white p-6">
      <div className="rounded-lg bg-primary-100 p-3 text-primary-600">
        {icon}
      </div>
      <div>
        <h3 className="mb-1 text-h4 text-secondary-900">{title}</h3>
        <p className="mb-2 text-sm text-secondary-600">{description}</p>
        {action}
      </div>
    </div>
  );
}
