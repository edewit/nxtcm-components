/* eslint-disable react/display-name */
import { test, expect } from '@playwright/experimental-ct-react';
import { LoadingPanel } from './LoadingPanel';

type TestData = {
  id: number;
  name: string;
};

test.describe('LoadingPanel', () => {
  test('should show loading spinner while callback is executing', async ({ mount }) => {
    let callbackCalled = false;
    const callback = async () => {
      callbackCalled = true;
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { id: 1, name: 'Test' } as TestData;
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return <div data-testid="content">{data.name}</div>;
          }}
      </LoadingPanel>
    );

    // Should show spinner initially
    const spinner = component.locator('[aria-label="Loading..."]');
    await expect(spinner).toBeVisible();

    // Wait for loading to complete
    await expect(component.getByTestId('content')).toBeVisible({ timeout: 2000 });
    await expect(spinner).not.toBeVisible();
    expect(callbackCalled).toBe(true);
  });

  test('should render children with data when callback succeeds', async ({ mount }) => {
    const testData: TestData = { id: 1, name: 'John Doe' };
    const callback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return testData;
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) return <div data-testid="error">Error: {error.message}</div>;
            if (!data) return <div data-testid="no-data">No data</div>;
            return (
              <div data-testid="content">
                <span data-testid="id">{data.id}</span>
                <span data-testid="name">{data.name}</span>
              </div>
            );
          }}
      </LoadingPanel>
    );

    await expect(component.getByTestId('content')).toBeVisible({ timeout: 2000 });
    await expect(component.getByTestId('id')).toContainText('1');
    await expect(component.getByTestId('name')).toContainText('John Doe');
  });

  test('should render children with error when callback fails', async ({ mount }) => {
    const errorMessage = 'Failed to fetch data';
    const callback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      throw new Error(errorMessage);
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) return <div data-testid="error">Error: {error.message}</div>;
            if (!data) return <div data-testid="no-data">No data</div>;
            return <div data-testid="content">{(data as TestData).name}</div>;
          }}
      </LoadingPanel>
    );

    await expect(component.getByTestId('error')).toBeVisible({ timeout: 2000 });
    await expect(component.getByTestId('error')).toContainText(errorMessage);
  });

  test('should handle null data correctly', async ({ mount }) => {
    const callback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return null as unknown as TestData;
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) return <div data-testid="error">Error</div>;
            if (!data) return <div data-testid="no-data">No data available</div>;
            return <div data-testid="content">{data.name}</div>;
          }}
      </LoadingPanel>
    );

    await expect(component.getByTestId('no-data')).toBeVisible({ timeout: 2000 });
  });

  test('should re-execute callback when callback prop changes', async ({ mount }) => {
    let callCount = 0;
    const callback1 = async () => {
      callCount++;
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { id: 1, name: 'First' } as TestData;
    };

    const component = await mount(
      <LoadingPanel callback={callback1}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return <div data-testid="content">{data.name}</div>;
          }}
      </LoadingPanel>
    );

    await expect(component.getByTestId('content')).toContainText('First', { timeout: 2000 });
    expect(callCount).toBe(1);

    // Update callback
    const callback2 = async () => {
      callCount++;
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { id: 2, name: 'Second' } as TestData;
    };

    await component.update(
      <LoadingPanel callback={callback2}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return <div data-testid="content">{data.name}</div>;
          }}
      </LoadingPanel>
    );

    // Should show spinner again
    await expect(component.locator('[aria-label="Loading..."]')).toBeVisible();
    // Then show new data
    await expect(component.getByTestId('content')).toContainText('Second', { timeout: 2000 });
    expect(callCount).toBe(2);
  });

  test('should handle array data correctly', async ({ mount }) => {
    const arrayData: TestData[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    const callback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return arrayData;
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return (
              <div data-testid="content">
                {data.map((item: TestData) => (
                  <div key={item.id} data-testid={`item-${item.id}`}>
                    {item.name}
                  </div>
                ))}
              </div>
            );
          }}
      </LoadingPanel>
    );

    await expect(component.getByTestId('content')).toBeVisible({ timeout: 2000 });
    await expect(component.getByTestId('item-1')).toContainText('Item 1');
    await expect(component.getByTestId('item-2')).toContainText('Item 2');
  });

  test('should handle string data correctly', async ({ mount }) => {
    const callback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return 'Hello World';
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return <div data-testid="content">{data}</div>;
          }}
      </LoadingPanel>
    );

    await expect(component.getByTestId('content')).toContainText('Hello World', { timeout: 2000 });
  });

  test('should handle number data correctly', async ({ mount }) => {
    const callback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return 42;
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return <div data-testid="content">{data}</div>;
          }}
      </LoadingPanel>
    );

    await expect(component.getByTestId('content')).toContainText('42', { timeout: 2000 });
  });

  test('should handle error with custom error message', async ({ mount }) => {
    const customError = new Error('Custom error message');
    const callback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      throw customError;
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) {
              return (
                <div data-testid="error">
                  <span data-testid="error-message">{error.message}</span>
                </div>
              );
            }
            if (!data) return <div>No data</div>;
            return <div>Content</div>;
          }}
      </LoadingPanel>
    );

    await expect(component.getByTestId('error')).toBeVisible({ timeout: 2000 });
    await expect(component.getByTestId('error-message')).toContainText('Custom error message');
  });

  test('should not show spinner after data is loaded', async ({ mount }) => {
    const callback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { id: 1, name: 'Test' } as TestData;
    };

    const component = await mount(
      <LoadingPanel callback={callback}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return <div data-testid="content">Loaded</div>;
          }}
      </LoadingPanel>
    );

    // Wait for content to appear
    await expect(component.getByTestId('content')).toBeVisible({ timeout: 2000 });

    // Spinner should not be visible
    const spinner = component.locator('[aria-label="Loading..."]');
    await expect(spinner).not.toBeVisible();
  });

  test('should handle rapid callback changes', async ({ mount }) => {
    const callback1 = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { id: 1, name: 'First' } as TestData;
    };

    const component = await mount(
      <LoadingPanel callback={callback1}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return <div data-testid="content">{data.name}</div>;
          }}
      </LoadingPanel>
    );

    // Quickly change callback before first one completes
    const callback2 = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { id: 2, name: 'Second' } as TestData;
    };

    // Wait a bit then update
    await new Promise((resolve) => setTimeout(resolve, 100));
    await component.update(
      <LoadingPanel callback={callback2}>
        {() =>
          ({ data, error }) => {
            if (error) return <div>Error</div>;
            if (!data) return <div>No data</div>;
            return <div data-testid="content">{data.name}</div>;
          }}
      </LoadingPanel>
    );

    // Should eventually show second callback's data
    await expect(component.getByTestId('content')).toContainText('Second', { timeout: 2000 });
  });
});
