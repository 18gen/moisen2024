<h1 align="center">医師と患者、患者の家族をつなぐプロダクト「今日どうだった？」 :stethoscope:</h1>

## Product
[ProtoPedia展示ページ](https://protopedia.net/prototype/5478)
(**"How was your day?"** that connects doctors, patients, and their families)

This product records conversations from medical consultations and summarizes them, allowing the patient, their family, and the doctor to share the information, enhancing understanding of the consultation results.
<p align="center"><img width="800" alt="stack" src="https://github.com/user-attachments/assets/2b435dad-56cc-405c-b05c-9c989c5c4022"></p>


## Tech Stack
- OpenAI API: Uses Whisper to convert audio to text.
- GPT-3.5-turbo: Summarizes text for different audiences (doctor, patient).
- Backend: Built using Next.js as a full-stack framework.
- Frontend: Developed with TypeScript, React, and Tailwind CSS.

<p align="center"><img width="600" alt="stack" src="https://github.com/user-attachments/assets/0b918037-0832-4801-a9c1-4e251b812d94"></p>

## Story
This product won both the **Grand Prize** and **Audience Award** at the 3rd Medical Hackathon by the Monozukuri Medical Center!

## Key Features
Supports both voice recording and text input. The AI summarizes the content clearly for patients and doctors.
For patients: Avoids difficult medical terms and provides concise information (also shared with family).
For doctors: Summaries follow SOAP format, suitable for inclusion in electronic medical records.
If elderly patients struggle with using smartphones or explaining the results to their family, the information can be shared with authorized family members via LINE.

## Importance of Sharing with the Patient's Family
From our development member's personal experience...
She has a father who has cancer and has been repeatedly admitted and discharged from the hospital.
Although he has a smartphone, he only uses it for calls and emails, and his IT literacy is quite low.
When she asks my father about the results of his consultation, it’s sometimes hard to understand, so the family has to call the hospital to confirm.
While it would be ideal for family members to always accompany him, this isn’t always possible.
As he’s been in and out of the hospital, his memory has become somewhat unclear, but he acts composed at the hospital, so the doctors don't notice.
In such situations, we felt the need for a product that could serve as a source of information to help the family support the patient.
