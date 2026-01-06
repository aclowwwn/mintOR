
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
      title: "Geometrie: Distanțe, Perpendicularitate și Unghiuri",
      description: "O serie de exerciții fundamentale despre distanța de la un punct la o dreaptă, linii paralele și perpendiculare, și proprietățile unghiurilor.",
      tags: ["geometrie", "clasa-6", "perpendicularitate"],
      difficulty: 2,
      order: 1,
      exercises: [
        {
          id: "ex-19-a",
          prompt: {
            text: "19. a) Determină distanța de la punctul A la dreapta a, știind că A ∈ a."
          },
          answer: {
            type: "numeric",
            value: 0,
            tolerance: 0
          },
          hints: [
            { id: "h1", text: "Distanța de la un punct la o dreaptă reprezintă lungimea perpendicularei." },
            { id: "h2", text: "Dacă punctul este deja pe dreaptă, segmentul are lungime zero." }
          ],
          solution: { text: "Distanța este 0 cm deoarece punctul aparține dreptei." },
          meta: { difficulty: 1, sourceRef: "19a" }
        },
        {
          id: "ex-19-b",
          prompt: {
            text: "19. b) Precizează poziția punctului B față de dreapta a, știind că distanța de la punctul B la dreapta a este egală cu 0 cm."
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "apartenenta", text: "B aparține dreptei a (B ∈ a)" },
              { id: "exterior", text: "B este în exteriorul dreptei a (B ∉ a)" }
            ],
            correctChoiceId: "apartenenta"
          },
          hints: [
            { id: "h1", text: "Gândește-te la definiția distanței: când este aceasta nulă?" }
          ],
          meta: { difficulty: 1, sourceRef: "19b" }
        },
        {
          id: "ex-20",
          prompt: {
            text: "20. Fie a, b și c trei drepte distincte două câte două, astfel încât a ⟂ c și b ⟂ c. Ce relație există între dreptele a și b?"
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "paralele", text: "a ∥ b (paralele)" },
              { id: "perpendiculare", text: "a ⟂ b (perpendiculare)" },
              { id: "identice", text: "a = b (identice)" }
            ],
            correctChoiceId: "paralele"
          },
          hints: [
            { id: "h1", text: "Două drepte perpendiculare pe aceeași a treia dreaptă sunt paralele între ele." }
          ],
          solution: { text: "Conform teoremei, dacă a ⟂ c și b ⟂ c, atunci a ∥ b." },
          meta: { difficulty: 2, sourceRef: "20" }
        },
        {
          id: "ex-21",
          prompt: {
            text: "21. Fie a, b, c și d patru drepte distincte două câte două, astfel încât a ∥ b, c ∥ d și a ⟂ c. Demonstrează relația dintre b și d."
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "paralele", text: "b ∥ d" },
              { id: "perpendiculare", text: "b ⟂ d" },
              { id: "niciuna", text: "Nicio relație specială" }
            ],
            correctChoiceId: "perpendiculare"
          },
          hints: [
            { id: "h1", text: "Dacă o dreaptă este perpendiculară pe una din două paralele, este perpendiculară și pe cealaltă." },
            { id: "h2", text: "Aplică succesiv proprietatea pentru perechile de paralele." }
          ],
          meta: { difficulty: 2, sourceRef: "21" }
        },
        {
          id: "ex-22",
          prompt: {
            text: "22. În figura 34 (patrulater), AB ∥ CD, AD ∥ BC și AD ⟂ DC. Determină măsura unghiului ABC în grade."
          },
          answer: {
            type: "numeric",
            value: 90,
            tolerance: 0
          },
          hints: [
            { id: "h1", text: "Figura este un paralelogram deoarece are laturile opuse paralele." },
            { id: "h2", text: "Dacă are un unghi drept (AD ⟂ DC), atunci paralelogramul este un dreptunghi." },
            { id: "h3", text: "Într-un dreptunghi, toate unghiurile au 90 de grade." }
          ],
          meta: { difficulty: 2, sourceRef: "22" }
        },
        {
          id: "ex-23",
          prompt: {
            text: "23. Fie A și B două puncte distincte. Pe perpendiculara în B pe dreapta AB se consideră un punct C. Ce relație există între mediatoarele segmentelor AB și BC?"
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "perp", text: "Sunt perpendiculare" },
              { id: "para", text: "Sunt paralele" },
              { id: "concur", text: "Se intersectează sub un unghi de 45°" }
            ],
            correctChoiceId: "perp"
          },
          hints: [
            { id: "h1", text: "Mediatoarea unui segment este perpendiculară pe segmentul respectiv." },
            { id: "h2", text: "AB și BC sunt perpendiculare în B." },
            { id: "h3", text: "Dacă două drepte sunt perpendiculare, atunci și perpendicularele pe ele (mediatoarele) vor fi perpendiculare între ele." }
          ],
          meta: { difficulty: 3, sourceRef: "23" }
        },
        {
          id: "ex-24",
          prompt: {
            text: "24. Unghiurile AOB și BOC sunt adiacente complementare. Demonstrează relația dintre dreptele OA și OC."
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "perp", text: "OA ⟂ OC" },
              { id: "colin", text: "O, A, C sunt coliniare" },
              { id: "paralel", text: "OA ∥ OC" }
            ],
            correctChoiceId: "perp"
          },
          hints: [
            { id: "h1", text: "Unghiuri complementare înseamnă că suma măsurilor lor este 90°." },
            { id: "h2", text: "Măsura unghiului AOC = m(AOB) + m(BOC)." }
          ],
          meta: { difficulty: 2, sourceRef: "24" }
        },
        {
          id: "ex-25",
          prompt: {
            text: "25. În figura 35 (MON și POQ obtuze), OM ⟂ OQ și ON ⟂ OP. Cum sunt unghiurile MON și POQ?"
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "congruente", text: "Congruente" },
              { id: "suplimentare", text: "Suplimentare" },
              { id: "complementare", text: "Complementare" }
            ],
            correctChoiceId: "congruente"
          },
          hints: [
            { id: "h1", text: "Unghiurile MON și POQ au laturile respectiv perpendiculare." },
            { id: "h2", text: "m(MON) = m(MOQ) + m(QON) = 90° + m(QON)." },
            { id: "h3", text: "m(POQ) = m(PON) + m(NOQ) = 90° + m(NOQ)." }
          ],
          solution: { text: "Ambele unghiuri au măsura egală cu 90° + m(NOQ), deci sunt congruente." },
          meta: { difficulty: 3, sourceRef: "25" }
        },
        {
          id: "ex-26",
          prompt: {
            text: "26. Unghiurile AOB și BOC sunt adiacente suplimentare, iar OM și ON sunt bisectoarele lor. Ce unghi formează dreptele OM și ON?"
          },
          answer: {
            type: "numeric",
            value: 90,
            tolerance: 0
          },
          hints: [
            { id: "h1", text: "Unghiurile suplimentare au suma de 180°." },
            { id: "h2", text: "Unghiul dintre bisectoare este m(AOB)/2 + m(BOC)/2." },
            { id: "h3", text: "Factorizează: (m(AOB) + m(BOC)) / 2." }
          ],
          meta: { difficulty: 2, sourceRef: "26" }
        },
        {
          id: "ex-27",
          prompt: {
            text: "27. Fie a și b paralele și c o secantă. Bisectoarele unghiurilor interne de aceeași parte a secantei sunt:"
          },
          answer: {
            type: "multiple_choice",
            choices: [
              { id: "perp", text: "Perpendiculare (90°)" },
              { id: "para", text: "Paralele" },
              { id: "congr", text: "Congruente" }
            ],
            correctChoiceId: "perp"
          },
          hints: [
            { id: "h1", text: "Unghiurile interne de aceeași parte a secantei sunt suplimentare (180°)." },
            { id: "h2", text: "Aplică aceeași logică ca la exercițiul precedent (26)." }
          ],
          meta: { difficulty: 3, sourceRef: "27" }
        },
        {
          id: "ex-28",
          prompt: {
            text: "28. AB = 10 cm, C ∈ AB, D mid AC, E mid CB, AD = 2 cm. Determină distanța de la punctul D la mediatoarea segmentului BC în cm."
          },
          answer: {
            type: "numeric",
            value: 5,
            tolerance: 0
          },
          hints: [
            { id: "h1", text: "Dacă D e mijlocul AC și AD=2, atunci AC=4, deci DC=2." },
            { id: "h2", text: "CB = AB - AC = 10 - 4 = 6 cm." },
            { id: "h3", text: "Mediatoarea lui BC trece prin mijlocul său, aflat la 3 cm de C." },
            { id: "h4", text: "Distanța este DC + (CB / 2)." }
          ],
          solution: { text: "AC=4. DC=2. CB=6. Mijlocul BC e la 3cm de C. Total: 2 + 3 = 5 cm." },
          meta: { difficulty: 3, sourceRef: "28" }
        },
        {
          id: "ex-29",
          prompt: {
            text: "29. ∠AOB = 150°. OC ⟂ OB, C ∈ Int(∠AOB). Determină măsura unghiului AOC în grade."
          },
          answer: {
            type: "numeric",
            value: 60,
            tolerance: 0
          },
          hints: [
            { id: "h1", text: "OC ⟂ OB înseamnă m(COB) = 90°." },
            { id: "h2", text: "Deoarece C este în interior, m(AOC) = m(AOB) - m(COB)." }
          ],
          meta: { difficulty: 2, sourceRef: "29" }
        },
        {
          id: "ex-30",
          prompt: {
            text: "30. a) ∠AOB = 70°, ∠BOC = 20° (interior), D ⟂ OA, D și A în același semiplan față de OC. Determină m(DOB) în grade."
          },
          answer: {
            type: "numeric",
            value: 20,
            tolerance: 0
          },
          hints: [
            { id: "h1", text: "OD ⟂ OA înseamnă m(DOA) = 90°." },
            { id: "h2", text: "m(DOB) = m(DOA) - m(AOB)." },
            { id: "h3", text: "Calculează: 90° - 70°." }
          ],
          meta: { difficulty: 3, sourceRef: "30a" }
        }
      ]
    }
  ]
};
