class Demo extends egret.DisplayObjectContainer {
    private bitmapMask: egret.Bitmap;
    private reverseMask: egret.Bitmap;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapped, this);
    }

    private onAddedToStage(event: egret.Event) {
        this.createDemoBg();
        this.createBitmapMask();
        this.createReverseMask();

        // 使用位图遮罩
        this.addChild(this.bitmapMask);
        this.mask = this.bitmapMask;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapped, this);
    }

    private createDemoBg() {
        this.addChild(new egret.Bitmap(RES.getRes('dom_png')));
    }

    private createBitmapMask() {
        this.bitmapMask = new egret.Bitmap(RES.getRes('mask_png'));
    }

    // 创建一个位图的反遮罩
    private createReverseMask() {
        // 将原来的遮罩图的混合模式设置为擦除
        let bitmapMask = new egret.Bitmap(RES.getRes('mask_png'));
        bitmapMask.blendMode = egret.BlendMode.ERASE;

        // 绘制一个黑色的Sprite作为反遮罩，然后把上面的遮罩加进去
        let reverseMask = new egret.Sprite();
        reverseMask.graphics.beginFill(0, 1);
        reverseMask.graphics.drawRect(0, 0, bitmapMask.width, bitmapMask.height);
        reverseMask.graphics.endFill();
        reverseMask.addChild(bitmapMask);

        // 创建一个RenderTexture，把反遮罩绘制上去
        let renderTex = new egret.RenderTexture();
        renderTex.drawToTexture(reverseMask);

        // 用得到的Texture创建一个Bitmap，这样就得到最终的反遮罩位图对象了
        this.reverseMask = new egret.Bitmap(renderTex);
    }

    private onTouchTapped(event: egret.Event) {
        // 点击时切换遮罩和反遮罩
        if (this.mask == this.bitmapMask) {
            this.mask = this.reverseMask;
            this.addChild(this.reverseMask);
            this.removeChild(this.bitmapMask);

        } else if (this.mask == this.reverseMask) {
            this.mask = this.bitmapMask;
            this.addChild(this.bitmapMask);
            this.removeChild(this.reverseMask);
        }
    }
}