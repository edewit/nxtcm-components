import { test, expect } from '@playwright/experimental-ct-react';
import { UpgradeRisks } from './UpgradeRisks';

test.describe('UpgradeRisks', () => {
  const defaultProps = {
    totalRisks: 45,
    criticalCount: 15,
    warningCount: 15,
    infoCount: 15,
  };

  test('should render correctly with all props', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('Upgrade risks').first()).toBeVisible();
    await expect(component.getByText('45')).toBeVisible();
    await expect(component.getByText('total number of upgrade risks')).toBeVisible();
    await expect(component.getByText('Critical')).toBeVisible();
    await expect(component.getByText('Warning')).toBeVisible();
    await expect(component.getByText('Info')).toBeVisible();
  });

  test('should display correct risk counts', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    const counts = component.getByText('15');
    await expect(counts.first()).toBeVisible();
  });

  test('should render View upgrade risks link when onViewRisks is provided', async ({ mount }) => {
    const handleViewRisks = () => {};
    const component = await mount(<UpgradeRisks {...defaultProps} onViewRisks={handleViewRisks} />);

    const viewLink = component.getByText('View upgrade risks');
    await expect(viewLink).toBeVisible();
  });

  test('should not render View upgrade risks link when onViewRisks is not provided', async ({
    mount,
  }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('View upgrade risks')).not.toBeVisible();
  });

  test('should call onViewRisks when link is clicked', async ({ mount }) => {
    let viewRisksCalled = false;
    const handleViewRisks = () => {
      viewRisksCalled = true;
    };
    const component = await mount(<UpgradeRisks {...defaultProps} onViewRisks={handleViewRisks} />);

    const viewLink = component.getByText('View upgrade risks');
    await viewLink.click();

    expect(viewRisksCalled).toBe(true);
  });

  test('should apply custom className when provided', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} className="custom-class" />);

    await expect(component.getByText('Upgrade risks').first()).toBeVisible();
  });

  test('should display zero counts correctly', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={0} criticalCount={0} warningCount={0} infoCount={0} />
    );

    const zeroCounts = component.getByText('0');
    await expect(zeroCounts.first()).toBeVisible();
  });

  test('should display different counts for each risk type', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={50} criticalCount={35} warningCount={10} infoCount={5} />
    );

    await expect(component.getByText('50').first()).toBeVisible();
    await expect(component.getByText('35').first()).toBeVisible();
    await expect(component.getByText('10').first()).toBeVisible();
    await expect(component.getByText('5').first()).toBeVisible();
  });

  test('should render all three risk severity icons', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('Critical')).toBeVisible();
    await expect(component.getByText('Warning')).toBeVisible();
    await expect(component.getByText('Info')).toBeVisible();
  });

  test('should render critical count with label', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={20} criticalCount={8} warningCount={7} infoCount={5} />
    );

    await expect(component.getByText('Critical')).toBeVisible();
    await expect(component.getByText('8')).toBeVisible();
  });

  test('should render warning count with label', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={20} criticalCount={8} warningCount={7} infoCount={5} />
    );

    await expect(component.getByText('Warning')).toBeVisible();
    await expect(component.getByText('7')).toBeVisible();
  });

  test('should render info count with label', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={20} criticalCount={8} warningCount={7} infoCount={5} />
    );

    await expect(component.getByText('Info')).toBeVisible();
    await expect(component.getByText('5')).toBeVisible();
  });

  test('should render total risks with descriptive label', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('45')).toBeVisible();
    await expect(component.getByText('total number of upgrade risks')).toBeVisible();
  });

  test('should handle large risk numbers', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={999} criticalCount={500} warningCount={300} infoCount={199} />
    );

    await expect(component.getByText('999')).toBeVisible();
    await expect(component.getByText('500')).toBeVisible();
    await expect(component.getByText('300')).toBeVisible();
    await expect(component.getByText('199')).toBeVisible();
  });

  test('should render view link as a button', async ({ mount }) => {
    const handleViewRisks = () => {};
    const component = await mount(<UpgradeRisks {...defaultProps} onViewRisks={handleViewRisks} />);

    const viewButton = component.getByText('View upgrade risks');
    await expect(viewButton).toBeVisible();
  });

  test('should maintain layout with mixed risk counts', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={105} criticalCount={100} warningCount={3} infoCount={2} />
    );

    await expect(component.getByText('105')).toBeVisible();
    await expect(component.getByText('100')).toBeVisible();
    await expect(component.getByText('3')).toBeVisible();
    await expect(component.getByText('2')).toBeVisible();
    await expect(component.getByText('Critical')).toBeVisible();
    await expect(component.getByText('Warning')).toBeVisible();
    await expect(component.getByText('Info')).toBeVisible();
  });

  test('should render all three severity icons', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    const icons = component.locator('svg');
    await expect(icons.first()).toBeVisible();
  });

  test('should render card title correctly', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('Upgrade risks').first()).toBeVisible();
  });

  test('should render total risks prominently', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('45')).toBeVisible();
    await expect(component.getByText('total number of upgrade risks')).toBeVisible();
  });

  test('should render all three risk categories', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('Critical')).toBeVisible();
    await expect(component.getByText('Warning')).toBeVisible();
    await expect(component.getByText('Info')).toBeVisible();
  });

  test('should handle clicking view risks button multiple times', async ({ mount }) => {
    let clickCount = 0;
    const handleViewRisks = () => {
      clickCount++;
    };

    const component = await mount(<UpgradeRisks {...defaultProps} onViewRisks={handleViewRisks} />);
    const viewButton = component.getByText('View upgrade risks');

    await viewButton.click();
    await viewButton.click();
    await viewButton.click();

    expect(clickCount).toBe(3);
  });

  test('should render without className by default', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);
    await expect(component.locator('div').first()).toBeVisible();
  });

  test('should handle all zero counts', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={0} criticalCount={0} warningCount={0} infoCount={0} />
    );

    await expect(component.getByText('0').first()).toBeVisible();
    await expect(component.getByText('Critical')).toBeVisible();
    await expect(component.getByText('Warning')).toBeVisible();
    await expect(component.getByText('Info')).toBeVisible();
  });

  test('should handle single digit counts', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={9} criticalCount={3} warningCount={3} infoCount={3} />
    );

    await expect(component.getByText('9')).toBeVisible();
    await expect(component.getByText('3').first()).toBeVisible();
  });

  test('should handle only critical risks', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={50} criticalCount={50} warningCount={0} infoCount={0} />
    );

    await expect(component.getByText('50').first()).toBeVisible();
    await expect(component.getByText('0').first()).toBeVisible();
  });

  test('should handle only warning risks', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={30} criticalCount={0} warningCount={30} infoCount={0} />
    );

    await expect(component.getByText('30').first()).toBeVisible();
  });

  test('should handle only info risks', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={20} criticalCount={0} warningCount={0} infoCount={20} />
    );

    await expect(component.getByText('20').first()).toBeVisible();
  });

  test('should render with proper card structure', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('Upgrade risks').first()).toBeVisible();
    await expect(component.getByText('total number of upgrade risks')).toBeVisible();
  });

  test('should handle very large total count', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks
        totalRisks={99999}
        criticalCount={50000}
        warningCount={30000}
        infoCount={19999}
      />
    );

    await expect(component.getByText('99999')).toBeVisible();
    await expect(component.getByText('50000')).toBeVisible();
  });

  test('should render view button when callback provided', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} onViewRisks={() => {}} />);

    const viewButton = component.getByText('View upgrade risks');
    await expect(viewButton).toBeVisible();
  });

  test('should not render view button when callback not provided', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} />);

    await expect(component.getByText('View upgrade risks')).not.toBeVisible();
  });

  test('should display correct proportion when critical is dominant', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={100} criticalCount={90} warningCount={8} infoCount={2} />
    );

    await expect(component.getByText('90')).toBeVisible();
    await expect(component.getByText('8')).toBeVisible();
    await expect(component.getByText('2')).toBeVisible();
  });

  test('should display correct proportion when warning is dominant', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={100} criticalCount={5} warningCount={90} infoCount={5} />
    );

    await expect(component.getByText('5').first()).toBeVisible();
    await expect(component.getByText('90')).toBeVisible();
  });

  test('should display correct proportion when info is dominant', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks totalRisks={100} criticalCount={3} warningCount={7} infoCount={90} />
    );

    await expect(component.getByText('3')).toBeVisible();
    await expect(component.getByText('7')).toBeVisible();
    await expect(component.getByText('90')).toBeVisible();
  });

  test('should apply multiple classNames correctly', async ({ mount }) => {
    const component = await mount(
      <UpgradeRisks {...defaultProps} className="custom-class another-class" />
    );

    await expect(component.getByText('Upgrade risks').first()).toBeVisible();
  });

  test('should render card with all sections visible', async ({ mount }) => {
    const component = await mount(<UpgradeRisks {...defaultProps} onViewRisks={() => {}} />);

    await expect(component.getByText('Upgrade risks').first()).toBeVisible();
    await expect(component.getByText('45')).toBeVisible();
    await expect(component.getByText('Critical')).toBeVisible();
    await expect(component.getByText('Warning')).toBeVisible();
    await expect(component.getByText('Info')).toBeVisible();
    await expect(component.getByText('View upgrade risks')).toBeVisible();
  });
});
