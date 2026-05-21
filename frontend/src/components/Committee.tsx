import React from "react";
import { SITE_URL } from "../utils/meta";
import { PageMeta } from "../utils/PageMeta";

interface BoardMember {
  name: string;
  role: string;
  job: string;
  bio: string;
  sameAs?: string;
  photo: string;
}

const BUREAU_2026: BoardMember[] = [
  {
    name: "Dr Héloïse Bernard",
    role: "Présidente",
    job: "Pédopsychiatre",
    bio: "Pédopsychiatre spécialisée en santé mentale de l'enfant et de l'adolescent, engagée pour une santé mentale numérique éthique et inclusive.",
    sameAs: "https://linktr.ee/drheloisebernard.pedopsy",
    photo: "/heloise.jpg",
  },
  {
    name: "Arnaud Bressot",
    role: "Vice-président",
    job: "Ingénieur IA, MentalTechMaker",
    bio: "Consultant IA en santé mentale, fondateur de MentalTechMaker. Conçoit des outils d'intelligence artificielle au service des professionnels de santé.",
    sameAs: "https://www.linkedin.com/in/abressot/",
    photo: "/arnaud.jpg",
  },
  {
    name: "Virginie Malnoy",
    role: "Trésorière",
    job: "Co-fondatrice de Pleinia",
    bio: "Co-fondatrice de Pleinia, copilote de la santé mentale en entreprise. Construit des solutions d'accompagnement en NLP pour la qualité de vie au travail.",
    sameAs: "https://fr.linkedin.com/in/virginie-malnoy",
    photo: "/virginie.jpg",
  },
  {
    name: "Dr Julien Lelandais",
    role: "Secrétaire",
    job: "Psychiatre et entrepreneur",
    bio: "Psychiatre au CHU Caen Normandie, entrepreneur en innovation santé. Travaille à l'intersection de la clinique et du numérique.",
    sameAs: "https://www.linkedin.com/in/julien-lelandais-6b47a0139/",
    photo: "/julien.jpg",
  },
];

export const Committee: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Bureau du Collectif MentalTech - Comité 2026"
        description="Découvrez le bureau 2026 du Collectif MentalTech : pédopsychiatre, psychiatre, ingénieur IA, co-fondatrice de plateforme. Gouvernance et expertise au service de la santé mentale numérique en France."
        canonical="/bureau"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Bureau du Collectif MentalTech 2026",
          url: `${SITE_URL}/bureau`,
          inLanguage: "fr",
          about: {
            "@type": "Organization",
            name: "Collectif MentalTech",
            url: "https://mentaltech.fr",
            member: BUREAU_2026.map((m) => ({
              "@type": "Person",
              name: m.name,
              jobTitle: m.role,
              description: m.job,
              image: `${SITE_URL}${m.photo}`,
              sameAs: m.sameAs,
            })),
          },
        }}
      />
      <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            💙 Le bureau du Collectif MentalTech
          </h1>
          <p className="text-xl text-text-secondary">
            Gouvernance et expertise au service de la santé mentale numérique
          </p>
        </div>

        <section className="bg-white rounded-2xl border border-gray-200 p-4 md:p-8 overflow-hidden">
          <figure className="space-y-3">
            <img
              src="/bureau-2026.jpg"
              alt="Bureau 2026 du Collectif MentalTech : Dr Héloïse Bernard, Arnaud Bressot, Virginie Malnoy, Dr Julien Lelandais"
              className="w-full h-auto rounded-xl"
              loading="lazy"
              width={2000}
              height={1125}
            />
            <figcaption className="text-sm text-text-secondary text-center">
              Le bureau 2026 du Collectif MentalTech
            </figcaption>
          </figure>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center">
            Composition du bureau
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUREAU_2026.map((member) => (
              <article
                key={member.name}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={member.photo}
                    alt={`Portrait de ${member.name}`}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/20"
                    loading="lazy"
                    width={80}
                    height={80}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold">{member.role}</p>
                    <p className="text-sm text-text-secondary">{member.job}</p>
                  </div>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {member.bio}
                </p>
                {member.sameAs && (
                  <a
                    href={member.sameAs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    Profil public ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">
            Notre mission
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Le Collectif MentalTech rassemble des acteurs engagés de la santé
            mentale numérique en France - cliniciens, éditeurs, chercheurs,
            patients-experts - autour d'une exigence commune : rendre le
            numérique en santé mentale plus rigoureux, plus éthique et plus
            accessible.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Le bureau, élu chaque année, est garant de la gouvernance, du cadre
            éthique et des orientations stratégiques du collectif. MentalTech
            Discover, l'annuaire indépendant que vous consultez, est l'une des
            initiatives portées par le collectif.
          </p>
          <div className="pt-2">
            <a
              href="https://mentaltech.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Découvrir le Collectif MentalTech ↗
            </a>
          </div>
        </section>
      </div>
    </div>
    </>
  );
};
