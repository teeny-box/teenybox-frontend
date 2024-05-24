import "./PromotionList.scss";
import { Children } from "react";
import { PromotionListCard } from "./PromotionCard";

export default function PromotionList({ newList }) {
  return <div className="promotion-list-box">{Children.toArray(newList.map((post, idx) => <PromotionListCard post={post} idx={idx} />))}</div>;
}
