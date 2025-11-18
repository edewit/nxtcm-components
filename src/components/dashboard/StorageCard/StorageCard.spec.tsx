import { test, expect } from '@playwright/experimental-ct-react';
import { StorageCard, StorageCardProps } from './StorageCard';

const mockStorageData: StorageCardProps['storageData'] = {
  rosaClusters: 63.02,
  aroClusters: 2.17,
  osdClusters: 2.17,
  available: 21.89,
};

test.describe('StorageCard', () => {
  test('should render the component with correct title', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    await expect(component.getByText('Storage').first()).toBeVisible();
  });

  test('should display the total storage used', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    const totalUsed = (63.02 + 2.17 + 2.17).toFixed(2);
    await expect(component.getByText(`${totalUsed} TiB`)).toBeVisible();
  });

  test('should display the correct usage percentage', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    const totalUsed = 63.02 + 2.17 + 2.17;
    const totalStorage = totalUsed + 21.89;
    const percentage = Math.round((totalUsed / totalStorage) * 100);
    await expect(component.getByText(`${percentage}%`)).toBeVisible();
  });

  test('should display ROSA clusters storage', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    await expect(component.getByText('ROSA clusters:')).toBeVisible();
    await expect(component.getByText('63.02 TiB')).toBeVisible();
  });

  test('should display ARO clusters storage', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    await expect(component.getByText('ARO Clusters:')).toBeVisible();
    const aroValues = component.getByText('2.17 TiB');
    await expect(aroValues.first()).toBeVisible();
  });

  test('should display OSD clusters storage', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    await expect(component.getByText('OSD Clusters:')).toBeVisible();
  });

  test('should display available storage', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    await expect(component.getByText('Available:')).toBeVisible();
    await expect(component.getByText('21.89 TiB')).toBeVisible();
  });

  test('should not show "View more" button when onViewMore is not provided', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    await expect(component.getByText('View more')).not.toBeVisible();
  });

  test('should show "View more" button when onViewMore callback is provided', async ({ mount }) => {
    const handleViewMore = () => {};
    const component = await mount(
      <StorageCard storageData={mockStorageData} onViewMore={handleViewMore} />
    );
    await expect(component.getByText('View more')).toBeVisible();
  });

  test('should call onViewMore callback when button is clicked', async ({ mount }) => {
    let viewMoreCalled = false;
    const handleViewMore = () => {
      viewMoreCalled = true;
    };
    const component = await mount(
      <StorageCard storageData={mockStorageData} onViewMore={handleViewMore} />
    );

    const viewMoreButton = component.getByText('View more');
    await viewMoreButton.click();

    expect(viewMoreCalled).toBe(true);
  });

  test('should calculate percentage correctly for high usage', async ({ mount }) => {
    const highUsageData = {
      rosaClusters: 80.5,
      aroClusters: 10.2,
      osdClusters: 5.3,
      available: 4.0,
    };
    const component = await mount(<StorageCard storageData={highUsageData} />);

    const totalUsed = 80.5 + 10.2 + 5.3;
    const totalStorage = totalUsed + 4.0;
    const percentage = Math.round((totalUsed / totalStorage) * 100);

    await expect(component.getByText(`${percentage}%`)).toBeVisible();
  });

  test('should calculate percentage correctly for low usage', async ({ mount }) => {
    const lowUsageData = {
      rosaClusters: 10.5,
      aroClusters: 5.2,
      osdClusters: 3.3,
      available: 81.0,
    };
    const component = await mount(<StorageCard storageData={lowUsageData} />);

    const totalUsed = 10.5 + 5.2 + 3.3;
    const totalStorage = totalUsed + 81.0;
    const percentage = Math.round((totalUsed / totalStorage) * 100);

    await expect(component.getByText(`${percentage}%`)).toBeVisible();
  });

  test('should display formatted numbers with two decimal places', async ({ mount }) => {
    const preciseData = {
      rosaClusters: 123.456,
      aroClusters: 45.678,
      osdClusters: 12.345,
      available: 67.89,
    };
    const component = await mount(<StorageCard storageData={preciseData} />);

    await expect(component.getByText('123.46 TiB')).toBeVisible();
    await expect(component.getByText('45.68 TiB')).toBeVisible();
    await expect(component.getByText('12.35 TiB')).toBeVisible();
    await expect(component.getByText('67.89 TiB')).toBeVisible();
  });

  test('should render SVG circular progress indicator', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    const svg = component.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('width', '200');
    await expect(svg).toHaveAttribute('height', '200');
  });

  test('should display total storage label correctly', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    await expect(component.getByText('Total storage used')).toBeVisible();
  });

  test('should render circular progress with correct viewBox', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    const svg = component.locator('svg');
    await expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
  });

  test('should display usage percentage in sublabel', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    const totalStorage = (63.02 + 2.17 + 2.17 + 21.89).toFixed(2);
    await expect(component.getByText(`of ${totalStorage} TiB used`)).toBeVisible();
  });

  test('should render all breakdown items', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);

    await expect(component.getByText('ROSA clusters:')).toBeVisible();
    await expect(component.getByText('ARO Clusters:')).toBeVisible();
    await expect(component.getByText('OSD Clusters:')).toBeVisible();
    await expect(component.getByText('Available:')).toBeVisible();
  });

  test('should handle zero storage usage', async ({ mount }) => {
    const zeroUsageData = {
      rosaClusters: 0,
      aroClusters: 0,
      osdClusters: 0,
      available: 100,
    };
    const component = await mount(<StorageCard storageData={zeroUsageData} />);

    await expect(component.getByText('0%')).toBeVisible();
    await expect(component.getByText('0.00 TiB').first()).toBeVisible();
  });

  test('should handle 100% storage usage', async ({ mount }) => {
    const fullUsageData = {
      rosaClusters: 50,
      aroClusters: 30,
      osdClusters: 20,
      available: 0,
    };
    const component = await mount(<StorageCard storageData={fullUsageData} />);

    await expect(component.getByText('100%')).toBeVisible();
    await expect(component.getByText('100.00 TiB').first()).toBeVisible();
  });

  test('should render correct storage breakdown for each cluster type', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);

    await expect(component.getByText('ROSA clusters:')).toBeVisible();
    await expect(component.getByText('ARO Clusters:')).toBeVisible();
    await expect(component.getByText('OSD Clusters:')).toBeVisible();
    await expect(component.getByText('Available:')).toBeVisible();
  });

  test('should handle decimal precision correctly', async ({ mount }) => {
    const precisionData = {
      rosaClusters: 1.111,
      aroClusters: 2.222,
      osdClusters: 3.333,
      available: 4.444,
    };
    const component = await mount(<StorageCard storageData={precisionData} />);

    const totalUsed = (1.111 + 2.222 + 3.333).toFixed(2);
    await expect(component.getByText(`${totalUsed} TiB`)).toBeVisible();
    await expect(component.getByText('4.44 TiB')).toBeVisible();
  });

  test('should render SVG with correct dimensions', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    const svg = component.locator('svg');

    await expect(svg).toHaveAttribute('width', '200');
    await expect(svg).toHaveAttribute('height', '200');
    await expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
  });

  test('should display total storage in sublabel', async ({ mount }) => {
    const totalUsed = 63.02 + 2.17 + 2.17;
    const totalStorage = totalUsed + 21.89;
    const component = await mount(<StorageCard storageData={mockStorageData} />);

    await expect(component.getByText(`of ${totalStorage.toFixed(2)} TiB used`)).toBeVisible();
  });

  test('should handle equal distribution across cluster types', async ({ mount }) => {
    const equalData = {
      rosaClusters: 25,
      aroClusters: 25,
      osdClusters: 25,
      available: 25,
    };
    const component = await mount(<StorageCard storageData={equalData} />);

    await expect(component.getByText('75%')).toBeVisible();
    const totalUsed = (25 + 25 + 25).toFixed(2);
    await expect(component.getByText(`${totalUsed} TiB`)).toBeVisible();
  });

  test('should handle very small storage values', async ({ mount }) => {
    const smallValues = {
      rosaClusters: 0.01,
      aroClusters: 0.02,
      osdClusters: 0.03,
      available: 99.94,
    };
    const component = await mount(<StorageCard storageData={smallValues} />);

    await expect(component.getByText('0.01 TiB')).toBeVisible();
    await expect(component.getByText('0.02 TiB')).toBeVisible();
    await expect(component.getByText('0.03 TiB')).toBeVisible();
  });

  test('should handle very large storage values', async ({ mount }) => {
    const largeValues = {
      rosaClusters: 9999.99,
      aroClusters: 8888.88,
      osdClusters: 7777.77,
      available: 3333.33,
    };
    const component = await mount(<StorageCard storageData={largeValues} />);

    await expect(component.getByText('9999.99 TiB')).toBeVisible();
    await expect(component.getByText('8888.88 TiB')).toBeVisible();
  });

  test('should render circles for progress indicator', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);
    const circles = component.locator('circle');

    await expect(circles.first()).toBeVisible();
  });

  test('should call onViewMore only when button is clicked', async ({ mount }) => {
    let clickCount = 0;
    const handleViewMore = () => {
      clickCount++;
    };
    const component = await mount(
      <StorageCard storageData={mockStorageData} onViewMore={handleViewMore} />
    );

    expect(clickCount).toBe(0);

    await component.getByText('View more').click();
    expect(clickCount).toBe(1);

    await component.getByText('View more').click();
    expect(clickCount).toBe(2);
  });

  test('should render card with proper structure', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);

    await expect(component.getByText('Storage').first()).toBeVisible();
    await expect(component.getByText('Total storage used')).toBeVisible();
  });

  test('should handle mid-range usage percentages', async ({ mount }) => {
    const midRangeData = {
      rosaClusters: 30,
      aroClusters: 15,
      osdClusters: 10,
      available: 45,
    };
    const component = await mount(<StorageCard storageData={midRangeData} />);

    await expect(component.getByText('55%')).toBeVisible();
  });

  test('should format numbers consistently across all fields', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);

    const tiBElements = component.getByText(/TiB/);
    await expect(tiBElements.first()).toBeVisible();
  });

  test('should display correct total used calculation', async ({ mount }) => {
    const totalUsed = (63.02 + 2.17 + 2.17).toFixed(2);
    const component = await mount(<StorageCard storageData={mockStorageData} />);

    await expect(component.getByText(`${totalUsed} TiB`)).toBeVisible();
    await expect(component.getByText('Total storage used')).toBeVisible();
  });

  test('should render without footer when no callback provided', async ({ mount }) => {
    const component = await mount(<StorageCard storageData={mockStorageData} />);

    await expect(component.getByText('Storage').first()).toBeVisible();
    await expect(component.getByText('View more')).not.toBeVisible();
  });
});
