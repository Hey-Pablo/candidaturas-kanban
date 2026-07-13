import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-card border border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Icon + Title */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-16 w-16 rounded-xl bg-indigo-500/10 flex items-center justify-center p-1.5">
              <img
                src="/logo.png"
                alt="Candidaturas Kanban"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          {/* Content */}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
