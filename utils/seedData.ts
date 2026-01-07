
import { ChapterPack } from '../types';

export const seedPack: ChapterPack = {
  schemaVersion: 1,
  pack: {
    id: "pack-geo-v2",
    title: "Curs 1: Geometrie Elementară",
    source: {
      type: "book",
      name: "Manual Geometrie",
      pages: "Capitolul 1"
    },
    createdAt: new Date().toISOString()
  },
  chapters: [
    {
      id: "ch-geometrie-01",
      title: "Geometrie: Distanțe și Linii",
      description: "O serie de exerciții fundamentale despre distanța de la un punct la o dreaptă, linii paralele și perpendiculare.",
      tags: ["geometrie", "clasa-6", "perpendicularitate"],
      difficulty: 2,
      order: 1,
      exercises: [
        {
          id: "ex-19-a",
          prompt: {
            text: "19. a) Determină distanța de la punctul A la dreapta a, știind că A ∈ a."
          },
          answer: { type: "numeric", value: 0, tolerance: 0 },
          hints: [
            { id: "h1", text: "Folosește Sandbox-ul: desenează o dreaptă 'a' și pune un punct 'A' chiar pe ea." },
            { id: "h2", text: "Distanța este lungimea perpendicularei. Dacă punctul e deja acolo, cât crezi că este lungimea segmentului?" }
          ],
          solution: { text: "Distanța este 0 deoarece punctul aparține dreptei." },
          meta: { difficulty: 1, sourceRef: "19a" }
        },
        {
          id: "ex-19-b",
          prompt: {
            text: "19. b) Determină distanța de la punctul A la dreapta a, știind că d(A, a) = 5 cm și M este piciorul perpendicularei din A pe a. Cât este lungimea segmentului AM?"
          },
          answer: { type: "numeric", value: 5, tolerance: 0.1 },
          hints: [
            { id: "h1", text: "Desenează în Sandbox un punct A și o dreaptă a, apoi trasează segmentul perpendicular AM." },
            { id: "h2", text: "Amintește-ți: distanța de la un punct la o dreaptă este exact lungimea segmentului perpendicular." }
          ],
          solution: { text: "AM = d(A, a) = 5 cm." },
          meta: { difficulty: 1, sourceRef: "19b" }
        },
        {
          id: "ex-20",
          prompt: {
            text: "20. Fie a, b și c trei drepte distincte astfel încât a ⟂ c și b ⟂ c. Ce relație există între dreptele a și b?"
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "paralele", text: "a ∥ b (paralele)" },
              { id: "perpendiculare", text: "a ⟂ b (perpendiculare)" }
            ],
            correctChoiceId: "paralele"
          },
          hints: [
            { id: "h1", text: "În Sandbox, încearcă să desenezi o dreaptă verticală 'c'. Apoi desenează o dreaptă orizontală 'a' care o taie perpendicular." },
            { id: "h2", text: "Acum mai desenează încă o dreaptă 'b', tot orizontală, care să fie perpendiculară pe 'c'. Cum arată 'a' față de 'b'?" }
          ],
          solution: { text: "Două drepte perpendiculare pe aceeași a treia dreaptă sunt paralele între ele." },
          meta: { difficulty: 2, sourceRef: "20" }
        },
        {
          id: "ex-21",
          prompt: {
            text: "21. Fie d1 ∥ d2 și d3 ⟂ d1. Ce relație există între d3 și d2?"
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "perp", text: "d3 ⟂ d2 (perpendiculare)" },
              { id: "para", text: "d3 ∥ d2 (paralele)" }
            ],
            correctChoiceId: "perp"
          },
          hints: [
            { id: "h1", text: "Desenează în Sandbox două linii paralele, d1 și d2." },
            { id: "h2", text: "Acum trasează d3 astfel încât să cadă perpendicular pe prima linie (d1). Verifică vizual cum cade pe d2." }
          ],
          solution: { text: "Dacă o dreaptă este perpendiculară pe una din două drepte paralele, ea este perpendiculară și pe cealaltă." },
          meta: { difficulty: 2, sourceRef: "21" }
        },
        {
          id: "ex-22",
          prompt: {
            text: "22. Determină măsura unghiului format de două drepte paralele."
          },
          answer: { type: "numeric", value: 0, tolerance: 0 },
          hints: [
            { id: "h1", text: "Gândește-te: se întâlnesc vreodată dreptele paralele pentru a forma un unghi?" },
            { id: "h2", text: "Prin convenție, direcțiile lor sunt identice, deci unghiul este nul." }
          ],
          meta: { difficulty: 1, sourceRef: "22" }
        },
        {
          id: "ex-23",
          prompt: {
            text: "23. Fie A și B două puncte. Pe perpendiculara în B pe AB se consideră un punct C. Ce relație există între mediatoarele segmentelor AB și BC?"
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "perp", text: "Sunt perpendiculare" },
              { id: "para", text: "Sunt paralele" }
            ],
            correctChoiceId: "perp"
          },
          hints: [
            { id: "h1", text: "Folosește Sandbox-ul pentru a desena segmentul AB (orizontal) și segmentul BC (vertical)." },
            { id: "h2", text: "Mediatoarea lui AB va fi verticală, iar mediatoarea lui BC va fi orizontală. Ce unghi formează ele?" }
          ],
          meta: { difficulty: 3, sourceRef: "23" }
        }
      ]
    }
  ]
};
