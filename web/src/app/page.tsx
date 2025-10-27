'use client';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">DWU CRM</h1>
      </div>

      {/* Páginas */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Páginas</h2>
        <ul className="list-inside space-y-1 list-none">
          <li>/clientes</li>
          <li>/clientes/[id]</li>
          <li>/oportunidades</li>
          <li>/kanban</li>
        </ul>
      </section>

      {/* API Routes */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Endpoints</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Clientes</h3>
          <ul className="list-inside space-y-1 list-none">
            <li>GET /clientes</li>
            <li>GET /clientes/:id</li>
            <li>POST /clientes</li>
            <li>PUT /clientes/:id</li>
            <li>DELETE /clientes/:id</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Oportunidades</h3>
          <ul className="list-inside space-y-1 list-none">
            <li>GET /oportunidades</li>
            <li>GET /oportunidades/:id</li>
            <li>POST /oportunidades</li>
            <li>PUT /oportunidades/:id</li>
            <li>PATCH /oportunidades/:id/estagio</li>
            <li>DELETE /oportunidades/:id</li>
          </ul>
        </div>
      </section>

      {/* Estágios */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Estágios</h2>
        <ul className="list-inside space-y-1 list-none">
          <li>Prospecção</li>
          <li>Qualificação</li>
          <li>Proposta</li>
          <li>Negociação</li>
          <li>Fechado</li>
        </ul>
      </section>
    </div>
  );
}