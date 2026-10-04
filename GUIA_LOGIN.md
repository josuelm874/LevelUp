# Guia: ativar login com Google

O botão "Continuar com Google" só funciona depois destes passos (ficam fora do código).

## 1. Google Cloud
1. https://console.cloud.google.com → criar projeto → **APIs e serviços > Tela de permissão OAuth** (externo, nome "System Level Up").
2. **Credenciais > Criar credenciais > ID do cliente OAuth > Aplicativo da Web**.
3. Em **URIs de redirecionamento autorizados** colocar:
   `https://kavahwegsdnesxzddhen.supabase.co/auth/v1/callback`
4. Copiar o **Client ID** e o **Client Secret**.

## 2. Supabase (projeto `kavahwegsdnesxzddhen`)
1. **Authentication > Providers > Google**: ativar e colar Client ID e Secret.
2. **Authentication > URL Configuration > Redirect URLs**: adicionar
   - `com.systemlevelup.app://login` (APK)
   - a URL onde o System.html roda no navegador (ex.: `http://localhost:8765/System.html`)
3. Defina o **Site URL** como a URL pública do app web (usada nos links de confirmação e recuperação de senha por e-mail).

## 3. Confirmação de e-mail
Mantida por link (padrão do Supabase). O link abre o Site URL e o app entra sozinho.
Para código de 6 dígitos em vez de link: **Authentication > Email Templates**, trocar `{{ .ConfirmationURL }}` por `{{ .Token }}` (exigiria também uma tela de código no app).
