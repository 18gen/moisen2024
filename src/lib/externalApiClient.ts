type SUMMARIZE_TARGET = 'for-doctor' | 'for-patient-or-key-person';

const transcriberClient =  {
  // TODO
  async soundToText(soundFilePath: string): Promise<string> {
    return "TODO: transcriberClient#soundToText() would return transcribedText.";
  },
};

const summarizerClient = {
  // TODO
  async summarize(textFromSound: string, additionalText: string | undefined, forWhom: SUMMARIZE_TARGET): Promise<string> {
    return "TODO: summarizerClient#summarize() would return summarizedText.";
  },
};

const externalApiClient = {
  async transcribedText(recordedSoundFilePath: string): Promise<string>  {
    return await transcriberClient.soundToText(recordedSoundFilePath);
  },

  async summarizeForPatientOrKeyPerson(textFromSound: string, additionalText: string): Promise<string>  {
    return await summarizerClient.summarize(textFromSound, additionalText, 'for-patient-or-key-person');
  },

  async summarizeForDoctor(textFromSound: string, additionalText: string): Promise<string>  {
    return await summarizerClient.summarize(textFromSound, additionalText, 'for-doctor');
  }
};

export default externalApiClient;
