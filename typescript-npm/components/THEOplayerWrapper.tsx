import React, {useEffect} from 'react';
import * as THEOplayer from 'theoplayer';
import {Player, PlayerConfiguration} from 'theoplayer';
import 'theoplayer/ui.css';

async function loadGoogleImaSdkScript(): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
    script.onload = (): void => {
      script.remove();
      resolve();
    };
    script.onerror = (): void => {
      script.remove();
      reject(new Error('Google IMA SDK could not be loaded'));
    };
    document.head.appendChild(script);
  });
}

function THEOplayerWrapper(props: { data: any; onPlay: any; }) {

    let el = React.createRef<HTMLDivElement>();

    useEffect(() => {
            if (el && el.current) {
                let element: HTMLDivElement = el.current;
                let configuration : PlayerConfiguration = {
                    license: process.env.theoplayerLicenseString,
                    libraryLocation: process.env.theoplayerLibraryLocation
                };
                let player : Player = new THEOplayer.Player(element, configuration);
                if (props.onPlay) {
                    player.addEventListener('play', props.onPlay);
                }
                const onFirstPlayCallback = (): void => {
                  player.removeEventListener('play', onFirstPlayCallback);
                  loadGoogleImaSdkScript().then(() => {
                    player.source = {};
                    player.source = {
                      sources: props.data.source.sources,
                      ads: [
                        {
                          integration: 'google-ima',
                          sources: props.data.vastUrl,
                        },
                      ],
                    };
                  });
                  player.play();
                };
                player.addEventListener('play', onFirstPlayCallback);
                player.source = props.data.source;
            }

    }, []);
    return (<
            div
            className={"video-js theoplayer-skin vjs-16-9"}
            ref={el}
        />
    );

}

export default THEOplayerWrapper;
