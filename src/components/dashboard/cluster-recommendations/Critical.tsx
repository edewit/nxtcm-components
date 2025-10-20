import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import { CriticalRiskIcon } from "@patternfly/react-icons";
import { useState } from "react";

import styles from "./Critical.module.scss";

export type CriticalProps = {
  count: number;
  onViewRecommendations: () => void;
};

export const Critical = ({ count, onViewRecommendations }: CriticalProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
      <AccordionItem isExpanded={isExpanded}>
        <AccordionToggle
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          id="clusterRecommendationsToggle"
        >
          Cluster Recommendations
        </AccordionToggle>
        <AccordionContent>
          <p>
            Conditions that cause issues have been detected actively detected on
            your systems.
          </p>
          <Flex
            direction={{ default: "column" }}
            alignItems={{ default: "alignItemsCenter" }}
          >
            <FlexItem className={styles.danger}>
              <CriticalRiskIcon /> {count}
            </FlexItem>
            <FlexItem>Critical recommendations</FlexItem>
            <FlexItem>
              <Button variant="secondary" onClick={onViewRecommendations}>
                View recommendations
              </Button>
            </FlexItem>
          </Flex>
        </AccordionContent>
      </AccordionItem>
  );
};
