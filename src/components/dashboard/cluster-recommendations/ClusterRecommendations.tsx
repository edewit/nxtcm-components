import { Accordion } from "@patternfly/react-core";
import { Critical, CriticalProps } from "./Critical";
import { RecommendationByCategory, RecommendationByCategoryProps } from "./RecommendationByCategory";

type ClusterRecommendationProps = CriticalProps & RecommendationByCategoryProps;

export const ClusterRecommendations = ({
  count,
  onViewRecommendations,
  ...rest
}: ClusterRecommendationProps) => {
  return (
    <Accordion>
      <Critical count={count} onViewRecommendations={onViewRecommendations} />
      <RecommendationByCategory {...rest} />
    </Accordion>
  );
};
