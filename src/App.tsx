import { useState, useEffect } from 'react';
import {
  ContentAuth,
  Claim,
  AssertionLabel,
  ImageProvenance,
  ISerializableClaim,
  CreativeWorkAssertion,
  RecorderFormat,
} from '@contentauth/sdk';
import { useProvenance, useThumbnailUrl } from '@contentauth/react-hooks';
import '@contentauth/web-components/dist/components/Popover';
import '@contentauth/web-components/dist/components/Icon';
import '@contentauth/web-components/dist/components/Indicator';
import '@contentauth/web-components/dist/components/panels/DiscretePanel';
import '@contentauth/web-components/dist/components/panels/sections/PanelSection';
import './App.css';

interface WebComponentsProps {
  imageUrl: string;
  provenance: ImageProvenance;
  viewMoreUrl: string;
}

function WebComponents({
  imageUrl,
  provenance,
  viewMoreUrl,
}: WebComponentsProps) {
  const [claim, setClaim] = useState<ISerializableClaim | null>(null);

  useEffect(() => {
    let dispose = () => {};
    provenance.activeClaim?.asSerializableData().then((result) => {
      setClaim(result.data);
      dispose = result.dispose;
    });
    return dispose;
  }, [provenance.activeClaim?.id]);

  return (
    <div className="web-components">
      <div className="wrapper">
        <img src={imageUrl} />
        {claim ? (
          <cai-popover interactive placement="right" arrowSize={1}>
            <cai-indicator slot="trigger"></cai-indicator>
            <cai-discrete-panel
              slot="content"
              claim={JSON.stringify(claim)}
              viewMoreUrl={viewMoreUrl}
              class="theme-spectrum"
            >
              <div slot="sections" className="sections">
                {/* Produced with section */}
                <cai-panel-section
                  header="Produced with"
                  helpText="Software used to make this content"
                  class="theme-spectrum"
                >
                  <div className="produced-with">
                    <cai-icon source={claim.recorder}></cai-icon>
                    <div>
                      <div>{claim.recorder}</div>
                      {claim.isBeta ? (
                        <div className="beta">Content Credentials (Beta)</div>
                      ) : null}
                    </div>
                  </div>
                </cai-panel-section>
                {/* Produced by section */}
                <cai-panel-section
                  header="Produced by"
                  helpText="Chosen name of the person who exported this content"
                  class="theme-spectrum"
                >
                  {claim.producer}
                </cai-panel-section>
                {/* Social media section */}
                <cai-panel-section
                  header="Social media"
                  helpText="Social media accounts connected to the producer of this content"
                  class="theme-spectrum"
                >
                  <div className="social-media">
                    {claim.socialAccounts.map((account) => (
                      <div key={account.url}>
                        <cai-icon source={account.url}></cai-icon>
                        <a href={account.url} target="_blank">
                          @{account.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </cai-panel-section>
                {/* Custom section */}
                <cai-panel-section
                  header="Number of actions"
                  helpText="Number of unique actions taken on this image"
                  class="theme-spectrum"
                >
                  {claim.assertions['c2pa.actions']?.actions?.length ??
                    'Unknown'}
                </cai-panel-section>
              </div>
            </cai-discrete-panel>
          </cai-popover>
        ) : null}
      </div>
    </div>
  );
}

interface ClaimInfoProps {
  claim: Claim;
  viewMoreUrl: string;
}

function ClaimInfo({ claim, viewMoreUrl }: ClaimInfoProps) {
  const thumbnailUrl = useThumbnailUrl(claim.asset);
  const creativeWork = claim.findAssertion(AssertionLabel.CreativeWork);
  const producer = creativeWork
    ? (creativeWork as CreativeWorkAssertion).producer
    : undefined;

  return (
    <table className="claim-info">
      <tbody>
        {thumbnailUrl ? (
          <tr>
            <td colSpan={2}>
              <img src={thumbnailUrl} style={{ width: 250, height: 'auto' }} />
            </td>
          </tr>
        ) : null}
        {producer ? (
          <tr>
            <td>Producer</td>
            <td>{producer.name}</td>
          </tr>
        ) : null}
        <tr>
          <td>Produced with</td>
          <td>{claim.formatRecorder(RecorderFormat.ProgramNameAndVersion)}</td>
        </tr>
        <tr>
          <td>Signed by</td>
          <td>{claim.signature.issuer}</td>
        </tr>
        <tr>
          <td>Signed on</td>
          <td>{claim.signature.date.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Number of ingredients</td>
          <td>{claim.ingredients.length}</td>
        </tr>
        <tr>
          <td colSpan={2}>
            <a href={viewMoreUrl} target="_blank">
              View more
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function App() {
  const sampleImage =
    'https://js-sdk.contentauthenticity.org/c2pa-samples/CAICAI.jpg';
  const provenance = useProvenance(sampleImage);
  const viewMoreUrl = ContentAuth.generateVerifyUrl(sampleImage);

  return (
    <div className="app">
      {provenance?.activeClaim ? (
        <div>
          <h3>Web components</h3>
          <WebComponents
            imageUrl={sampleImage}
            provenance={provenance}
            viewMoreUrl={viewMoreUrl}
          />
          <h3>React component</h3>
          <ClaimInfo claim={provenance.activeClaim} viewMoreUrl={viewMoreUrl} />
        </div>
      ) : null}
    </div>
  );
}

export default App;
