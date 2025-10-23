import {
  Tile,
  WizCardGroup,
  WizTiles,
} from "@patternfly-labs/react-form-wizard";
import {
  Grid,
  GridItem,
  Content,
  ContentVariants,
  ListItem,
  List,
} from "@patternfly/react-core";
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";
import { StandAloneTile } from "./StandAloneTile";
import { HostedTile } from "./HostedTile";

type ControlPlaneFieldProps = {
  virtualPrivateCloudLink: React.ReactNode;
  isTileSelected: string;
  isHCPDisabled: boolean;
  rosaHomeGetStartedLink?: React.ReactNode;
};

export const ControlPlaneField: React.FunctionComponent<
  ControlPlaneFieldProps
> = ({ virtualPrivateCloudLink, isHCPDisabled, rosaHomeGetStartedLink }) => {
  return (
    <Grid hasGutter span={12}>
      <GridItem span={12}>
        <WizCardGroup path="control-plane-tiles">
          <HostedTile
            isHostedDisabled={isHCPDisabled}
            rosaHomeGetStartedLink={rosaHomeGetStartedLink}
          />
          <StandAloneTile />
        </WizCardGroup>
      </GridItem>
      <GridItem span={6}>
        <Content component={ContentVariants.p}>
          {virtualPrivateCloudLink}
        </Content>
      </GridItem>
    </Grid>
  );
};
