import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/AuthLayout";

export function ForgotPasswordPage() {
  const { user, resetPassword } = useAuth();
  if (user) return <Navigate to="/" replace />;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await resetPassword(email);
    if (err) {
      setError(err);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <AuthLayout
        title="Email enviado!"
        subtitle={`Enviamos um link de recuperação para ${email}`}
      >
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Verifique sua caixa de entrada (e o spam) e clique no link para
            redefinir sua senha.
          </p>
          <Link
            to="/login"
            className="inline-block text-sm text-indigo-400 hover:text-indigo-300 hover:underline font-medium transition-colors"
          >
            Voltar para o login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Digite seu email e enviaremos um link de recuperação"
      footer={
        <>
          Lembrou a senha?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium transition-colors"
          >
            Fazer login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600" disabled={loading}>
          {loading ? "Enviando..." : "Enviar link de recuperação"}
        </Button>
      </form>
    </AuthLayout>
  );
}
