export interface ISpriteInfo {sprite: string, w: number, h: number, x: number, y: number}

export const spriteToPiece = (imgSrc: string, spriteData: Array<ISpriteInfo>, doneSplitting: (final: any) => void) => {
    const pieces: any = {};
    const img = new Image();

    img.onload = function() {
        spriteData.forEach(({x, y, w, h, sprite}:ISpriteInfo ) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = w;
            canvas.height = h;

            if(context) {
                context.drawImage(img, x, y, w, h, 0, 0, w, h);
                const dataUri = canvas.toDataURL('image/png');
                pieces[sprite] = dataUri;
            }
        });

        doneSplitting(pieces);
    };
        
    img.src = imgSrc;
}