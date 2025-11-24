import { useState, useEffect } from 'react';
import { useItem, useData } from '@patternfly-labs/react-form-wizard';
import YAML from 'yaml';
import { Alert, AlertVariant, Stack, StackItem, Title } from '@patternfly/react-core';
import { YamlCodeEditor } from '../../../YamlCodeEditor/YamlCodeEditor';

export const YamlEditorStep = () => {
  const data = useItem();
  const { update } = useData();
  const [yamlContent, setYamlContent] = useState('');
  const [parseError, setParseError] = useState<string>('');

  useEffect(() => {
    try {
      const yamlString = YAML.stringify(data);
      setYamlContent(yamlString);
      setParseError('');
    } catch (err) {
      setParseError('Error converting form data to YAML');
    }
  }, [data]);

  const handleYamlChange = (newYaml: string) => {
    setYamlContent(newYaml);

    try {
      const parsedData = YAML.parse(newYaml);
      update(parsedData);
      setParseError('');
    } catch (err: any) {
      setParseError(err?.message || 'Invalid YAML syntax');
    }
  };

  return (
    <Stack hasGutter style={{ padding: '24px' }}>
      <StackItem>
        <Title headingLevel="h2">YAML Configuration</Title>
        <p style={{ color: 'var(--pf-v6-global--Color--200)', marginTop: '8px' }}>
          Review and edit the YAML configuration.
        </p>
      </StackItem>

      {parseError && (
        <StackItem>
          <Alert variant={AlertVariant.danger} isInline title="YAML Parse Error">
            {parseError}
          </Alert>
        </StackItem>
      )}

      <StackItem>
        <YamlCodeEditor
          code={yamlContent}
          onChange={handleYamlChange}
          height="600px"
          isReadOnly={false}
          isLineNumbersVisible={true}
          aria-label="Cluster configuration YAML editor"
        />
      </StackItem>
    </Stack>
  );
};
