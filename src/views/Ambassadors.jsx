import React from "react";
import { Link } from "@/lib/navigation";
import InfoPage from "@/components/layout/InfoPage";

export default function Ambassadors() {
  return (
    <InfoPage title="Амбассадорам" intro="Станьте лицом What the fashion и помогайте сообществу расти.">
      <div className="space-y-8 text-base text-muted-foreground">
        <p>Амбассадоры — это креативы, которые делятся платформой со своим сообществом и получают доступ к закрытым проектам и коллаборациям.</p>
        <ul className="space-y-3 border-y border-border py-6">
          <li>· Ранний доступ к новым возможностям</li>
          <li>· Закрытые коллаборации с брендами</li>
          <li>· Поддержка и продвижение ваших работ</li>
        </ul>
        <p>Подайте заявку — мы свяжемся с вами в течение недели.</p>
      </div>
      <Link to="/contact" className="btn-primary mt-10">Подать заявку</Link>
    </InfoPage>
  );
}