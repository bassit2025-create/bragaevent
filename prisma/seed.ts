import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories = [
  { name: "Música", icon: "🎵", color: "#FF5A3C" },
  { name: "Festas", icon: "🎉", color: "#D6318C" },
  { name: "Cultura", icon: "🎨", color: "#2952E3" },
  { name: "Gastronomia", icon: "🍔", color: "#F2A900" },
  { name: "Desporto", icon: "🏃", color: "#12A879" },
  { name: "Mercados", icon: "🛍️", color: "#A35B1F" },
  { name: "Workshops", icon: "🎓", color: "#7C4DFF" },
  { name: "Família", icon: "👨‍👩‍👧", color: "#12A879" },
];

function daysFromNow(days: number, hour = 21, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  console.log("Seeding database…");

  // --- Admin user -----------------------------------------------------
  const adminEmail = "admin@bragaevent.pt";
  const adminPassword = "BragaEvent#2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      name: "Admin Braga Event",
      role: "SUPER_ADMIN",
    },
  });
  console.log(`Admin created -> ${adminEmail} / ${adminPassword}`);

  // --- Categories -------------------------------------------------------
  const categoryRecords = await Promise.all(
    categories.map((c) =>
      prisma.category.upsert({
        where: { slug: slugify(c.name) },
        update: { icon: c.icon, color: c.color },
        create: {
          name: c.name,
          slug: slugify(c.name),
          icon: c.icon,
          color: c.color,
        },
      })
    )
  );

  const catByName = (name: string) =>
    categoryRecords.find((c) => c.name === name)!.id;

  // --- Events -------------------------------------------------------
  const events = [
    {
      title: "Braga Music Nights",
      description:
        "Uma noite de concertos ao vivo no coração de Braga, com bandas emergentes do norte de Portugal. Som de qualidade, ambiente intimista e muita energia.",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(5, 21, 30),
      startTime: "21:30",
      endTime: "01:00",
      location: "Theatro Circo",
      address: "Av. da Liberdade 697, Braga",
      price: 0,
      isFree: true,
      organizer: "Associação Cultural do Minho",
      website: "https://theatrocirco.com",
      instagram: "https://instagram.com/theatrocirco",
      isFeatured: true,
      status: "PUBLISHED" as const,
      category: "Música",
    },
    {
      title: "Feira do Minho — Sabores & Artesanato",
      description:
        "Mercado tradicional com produtos regionais, artesanato local e gastronomia minhota. Um domingo em cheio para toda a família.",
      image:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(2, 10, 0),
      startTime: "10:00",
      endTime: "19:00",
      location: "Campo das Hortas",
      address: "Campo das Hortas, Braga",
      price: 0,
      isFree: true,
      organizer: "Câmara Municipal de Braga",
      website: "https://cm-braga.pt",
      instagram: null,
      isFeatured: true,
      status: "PUBLISHED" as const,
      category: "Mercados",
    },
    {
      title: "Braga Street Food Festival",
      description:
        "Food trucks, cerveja artesanal e DJ sets até tarde. O melhor da gastronomia de rua reúne-se no Parque de Exposições.",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(8, 18, 0),
      startTime: "18:00",
      endTime: "23:30",
      location: "Parque de Exposições de Braga",
      address: "Av. Dr. Francisco Pires Gonçalves, Braga",
      price: 5,
      isFree: false,
      organizer: "Braga Street Food",
      website: null,
      instagram: "https://instagram.com/bragastreetfood",
      isFeatured: true,
      status: "PUBLISHED" as const,
      category: "Gastronomia",
    },
    {
      title: "Workshop de Cerâmica para Principiantes",
      description:
        "Aprende as técnicas básicas de modelação e torno numa tarde criativa, com materiais incluídos. Vagas limitadas.",
      image:
        "https://images.unsplash.com/photo-1565193566173-7a0af771d71a?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(4, 15, 0),
      startTime: "15:00",
      endTime: "18:00",
      location: "Oficina Criativa Braga",
      address: "Rua do Anjo 45, Braga",
      price: 25,
      isFree: false,
      organizer: "Ateliê Terra",
      website: "https://atelieterra.pt",
      instagram: "https://instagram.com/atelieterra",
      isFeatured: false,
      status: "PUBLISHED" as const,
      category: "Workshops",
    },
    {
      title: "Trail Run Bom Jesus",
      description:
        "Prova de trail running com 12km e 21km em torno do Santuário do Bom Jesus. Inclui hidratação e kit de participante.",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(12, 9, 0),
      startTime: "09:00",
      endTime: "13:00",
      location: "Santuário do Bom Jesus do Monte",
      address: "Bom Jesus, Braga",
      price: 15,
      isFree: false,
      organizer: "Braga Trail Runners",
      website: "https://bragatrail.pt",
      instagram: "https://instagram.com/bragatrailrunners",
      isFeatured: false,
      status: "PUBLISHED" as const,
      category: "Desporto",
    },
    {
      title: "Noite de Fado no Centro Histórico",
      description:
        "Uma noite intimista de fado numa das casas mais icónicas do centro histórico de Braga. Reserva antecipada recomendada.",
      image:
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(6, 21, 0),
      startTime: "21:00",
      endTime: "23:30",
      location: "Casa do Fado de Braga",
      address: "Rua de São Marcos 12, Braga",
      price: 12,
      isFree: false,
      organizer: "Casa do Fado de Braga",
      website: null,
      instagram: "https://instagram.com/casadofadobraga",
      isFeatured: false,
      status: "PUBLISHED" as const,
      category: "Cultura",
    },
    {
      title: "Manhã em Família no Parque da Ponte",
      description:
        "Atividades ao ar livre, jogos tradicionais e insuflável gigante para toda a família. Entrada livre.",
      image:
        "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(3, 10, 30),
      startTime: "10:30",
      endTime: "13:00",
      location: "Parque da Ponte",
      address: "Parque da Ponte, Braga",
      price: 0,
      isFree: true,
      organizer: "Câmara Municipal de Braga",
      website: "https://cm-braga.pt",
      instagram: null,
      isFeatured: false,
      status: "PUBLISHED" as const,
      category: "Família",
    },
    {
      title: "Braga Indie Party",
      description:
        "A festa indie mais quente da cidade volta com DJs residentes e convidados especiais. Open bar até à 1h.",
      image:
        "https://images.unsplash.com/photo-1571266028243-e4bb35a03f0e?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(9, 23, 0),
      startTime: "23:00",
      endTime: "04:00",
      location: "Praça Velha Club",
      address: "Praça Conde de Agrolongo, Braga",
      price: 8,
      isFree: false,
      organizer: "Praça Velha Club",
      website: null,
      instagram: "https://instagram.com/pracavelhaclub",
      isFeatured: true,
      status: "PUBLISHED" as const,
      category: "Festas",
    },
    {
      title: "Exposição: Braga Contemporânea",
      description:
        "Mostra colectiva de artistas plásticos bracarenses, com curadoria do GNRation. Entrada gratuita durante todo o mês.",
      image:
        "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(1, 14, 0),
      startTime: "14:00",
      endTime: "19:00",
      location: "GNRation",
      address: "Praça Conde Agrolongo 123, Braga",
      price: 0,
      isFree: true,
      organizer: "GNRation",
      website: "https://gnration.pt",
      instagram: "https://instagram.com/gnration",
      isFeatured: false,
      status: "PUBLISHED" as const,
      category: "Cultura",
    },
    {
      title: "Mercado Vintage de Braga",
      description:
        "Roupa em segunda mão, discos de vinil, e achados retro de várias décadas. Um clássico mensal para os caçadores de tesouros.",
      image:
        "https://images.unsplash.com/photo-1526178613658-3f1622045557?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(15, 11, 0),
      startTime: "11:00",
      endTime: "18:00",
      location: "Mercado Municipal de Braga",
      address: "Praça do Comércio, Braga",
      price: 0,
      isFree: true,
      organizer: "Vintage Market Braga",
      website: null,
      instagram: "https://instagram.com/vintagemarketbraga",
      isFeatured: false,
      status: "PUBLISHED" as const,
      category: "Mercados",
    },
    {
      title: "Torneio de Futsal Solidário",
      description:
        "Torneio entre equipas locais a favor de uma instituição de solidariedade social. Inscrições no local.",
      image:
        "https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(20, 16, 0),
      startTime: "16:00",
      endTime: "20:00",
      location: "Pavilhão Municipal",
      address: "Rua Prof. Machado Vilela, Braga",
      price: 0,
      isFree: true,
      organizer: "Associação Desportiva de Braga",
      website: null,
      instagram: null,
      isFeatured: false,
      status: "DRAFT" as const,
      category: "Desporto",
    },
    {
      title: "Workshop de Fotografia de Rua",
      description:
        "Sessão prática de fotografia de rua pelo centro histórico de Braga, seguida de análise de imagens em grupo.",
      image:
        "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=1600&auto=format&fit=crop",
      date: daysFromNow(7, 10, 0),
      startTime: "10:00",
      endTime: "13:00",
      location: "Praça da República",
      address: "Praça da República, Braga",
      price: 18,
      isFree: false,
      organizer: "Foco Braga",
      website: "https://focobraga.pt",
      instagram: "https://instagram.com/focobraga",
      isFeatured: false,
      status: "PUBLISHED" as const,
      category: "Workshops",
    },
  ];

  for (const e of events) {
    const slug = slugify(e.title);
    await prisma.event.upsert({
      where: { slug },
      update: {},
      create: {
        title: e.title,
        slug,
        description: e.description,
        image: e.image,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        address: e.address,
        price: e.price,
        isFree: e.isFree,
        organizer: e.organizer,
        website: e.website,
        instagram: e.instagram,
        isFeatured: e.isFeatured,
        status: e.status,
        categoryId: catByName(e.category),
        views: Math.floor(Math.random() * 500),
      },
    });
  }
  console.log(`Seeded ${events.length} events.`);

  // --- Banners -------------------------------------------------------
  const now = new Date();
  const banners = [
    {
      name: "Café Rioja — Promoção de Verão",
      projectName: "Café Rioja",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop",
      destinationUrl: "https://example.com/cafe-rioja",
      description: "15% de desconto em todas as bebidas frias até final do mês.",
      startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      status: "ACTIVE" as const,
      impressions: 4210,
      clicks: 187,
    },
    {
      name: "Braga Coworking — Espaços Disponíveis",
      projectName: "Hub Braga",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
      destinationUrl: "https://example.com/hub-braga",
      description: "Primeira semana grátis para novos membros.",
      startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      status: "ACTIVE" as const,
      impressions: 2830,
      clicks: 94,
    },
    {
      name: "Loja Vintage do Minho",
      projectName: "Vintage do Minho",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop",
      destinationUrl: "https://example.com/vintage-minho",
      description: "Nova coleção outono/inverno já disponível.",
      startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      status: "SCHEDULED" as const,
      impressions: 0,
      clicks: 0,
    },
    {
      name: "Ginásio Corpo Ativo",
      projectName: "Corpo Ativo",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
      destinationUrl: "https://example.com/corpo-ativo",
      description: "Campanha de inscrições de setembro já terminou.",
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      status: "EXPIRED" as const,
      impressions: 8120,
      clicks: 312,
    },
  ];

  for (const b of banners) {
    const existing = await prisma.banner.findFirst({
      where: { name: b.name },
    });
    if (!existing) {
      await prisma.banner.create({ data: b });
    }
  }
  console.log(`Seeded ${banners.length} banners.`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
