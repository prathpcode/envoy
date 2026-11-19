import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@pixel3d/ui";

export default function AccordionFaq() {
  return (
    <Accordion type="single" collapsible defaultValue="team" className="w-full max-w-xl">
      <AccordionItem value="team">
        <AccordionTrigger>How big can a team be?</AccordionTrigger>
        <AccordionContent>Up to four people. Solo hackers are welcome too.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="code">
        <AccordionTrigger>Can I start coding before kickoff?</AccordionTrigger>
        <AccordionContent>Sketch all you like, but every commit has to land after Friday 6pm.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="food">
        <AccordionTrigger>Is there food?</AccordionTrigger>
        <AccordionContent>Pizza at midnight, coffee all weekend, and a vegan table by the stage.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
