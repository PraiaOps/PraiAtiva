import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware para tratamento de rotas
export function middleware(request: NextRequest) {
  // Obtém o caminho atual da URL
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Se estiver na raiz, não é necessário fazer nada
  // Já vai ser direcionado para a página inicial (app/page.tsx)
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Permite acesso normal a outras rotas
  return NextResponse.next();
}

// Configuração para quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens do Next.js)
     * - favicon.ico (favicon)
     * - public files (arquivos dentro da pasta public)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 