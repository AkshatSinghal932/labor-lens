
"use server";

import { prioritizeReportsBySeverity } from '@/ai/flows/prioritize-reports-by-severity';
import type { Report, ReportType } from '@/types';
import { z } from 'zod';
// import { db } from '@/lib/firebase'; // Assuming firebase is set up
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const reportSchema = z.object({
  dateOfIncidence: z.string().datetime(),
  location: z.string().min(1),
  city: z.string().min(1),
  typeOfIncidence: z.enum(['Wage Theft', 'Safety Violation', 'Unfair Wages', 'Unsafe Working Conditions', 'Other']),
  description: z.string().min(10),
  anonymousUserId: z.string().uuid(),
  // mediaProof would be handled separately (file upload to storage)
});

// Helper to convert file to data URI for AI flow if needed by other flows
// For prioritizeReportsBySeverity, only text is needed.
// const fileToDataURI = async (file: File): Promise<string> => {
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   return `data:${file.type};base64,${buffer.toString('base64')}`;
// };

export async function submitReportAction(formData: FormData) {
  try {
    const rawData = {
      dateOfIncidence: formData.get('dateOfIncidence') as string,
      location: formData.get('location') as string,
      city: formData.get('city') as string,
      typeOfIncidence: formData.get('typeOfIncidence') as ReportType,
      description: formData.get('description') as string,
      anonymousUserId: formData.get('anonymousUserId') as string,
      // mediaProofFile: formData.get('mediaProof') as File | null,
    };

    const validation = reportSchema.safeParse(rawData);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.flatten().fieldErrors);
      return { success: false, error: "Invalid form data. " + JSON.stringify(validation.error.flatten().fieldErrors) };
    }

    const validatedData = validation.data;

    // 1. AI Prioritization
    let aiSummary;
    try {
        aiSummary = await prioritizeReportsBySeverity({
        reportText: validatedData.description, // City information could be added here if the AI model is trained to use it for prioritization
      });
    } catch (aiError) {
      console.error("AI prioritization error:", aiError);
      // Proceed without AI summary if it fails, or handle as critical error
      aiSummary = { severityScore: 0, reasoning: "AI analysis failed.", actionable: false };
    }
    
    // Placeholder for dispatching logic
    // In a real application, this would involve looking up contacts based on city and incident type,
    // and then using a notification service (e.g., email, SMS, API call).
    console.log(`[DISPATCH ACTION REQUIRED] Report for city: ${validatedData.city}, type: ${validatedData.typeOfIncidence}. Send to relevant authorities and media outlets.`);
    // Example:
    // if (validatedData.city === "Springfield" && validatedData.typeOfIncidence === "Safety Violation") {
    //   await sendEmailTo("springfield_safety_dept@example.com", "New Safety Violation Report", JSON.stringify(validatedData));
    //   await sendToJournalist("journalist_contact_springfield@example.com", "Tip: New Labor Report", JSON.stringify(validatedData));
    // }


    // 2. Store report in Firebase (conceptual)
    // const reportToStore: Omit<Report, 'id' | 'submittedAt' | 'status' | 'mediaProofUrl'> = {
    //   ...validatedData,
    //   submittedAt: serverTimestamp() as any, // Placeholder for actual Firestore Timestamp
    //   status: 'Pending',
    //   aiPrioritization: aiSummary,
    // };
    // if (rawData.mediaProofFile) {
    //   // Handle file upload to Firebase Storage here
    //   // const storageRef = ref(storage, `reports_media/${Date.now()}_${rawData.mediaProofFile.name}`);
    //   // await uploadBytes(storageRef, rawData.mediaProofFile);
    //   // reportToStore.mediaProofUrl = await getDownloadURL(storageRef);
    //   // reportToStore.mediaProof = { name: rawData.mediaProofFile.name, type: rawData.mediaProofFile.type }
    // }
    // const docRef = await addDoc(collection(db, "reports"), reportToStore);
    // const reportId = docRef.id;

    // For now, simulate success
    const reportId = `mock-${Date.now().toString().slice(-6)}`; 
    console.log("Report submitted (mock):", { reportId, ...validatedData, aiSummary });

    return { success: true, reportId, aiSummary };

  } catch (error) {
    console.error("Error submitting report:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}
