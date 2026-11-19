import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@pixel3d/ui";

export default function AccordionMultiple() {
  return (
    <Accordion type="multiple" defaultValue={["impact", "craft"]} className="w-full max-w-xl">
      <AccordionItem value="impact">
        <AccordionTrigger>Impact</AccordionTrigger>
        <AccordionContent>Does it solve a real problem for real people?</AccordionContent>
      </AccordionItem>
      <AccordionItem value="craft">
        <AccordionTrigger>Craft</AccordionTrigger>
        <AccordionContent>Does the demo actually work, end to end, live on stage?</AccordionContent>
      </AccordionItem>
      <AccordionItem value="fun">
        <AccordionTrigger>Delight</AccordionTrigger>
        <AccordionContent>Did the judges smile? That counts for a lot.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="late" disabled>
        <AccordionTrigger>Late entries</AccordionTrigger>
        <AccordionContent>Closed.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
