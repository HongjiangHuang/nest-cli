import {Generator} from '../../common/interfaces/generator.interface';
import {Readable, Writable} from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import {ReplaceTransform} from '../streams/replace.transform';
import {ClassNameBuilder} from '../builders/class-name.builder';
import {AssetEnum} from '../../common/enums/asset.enum';
import {FileNameBuilder} from '../builders/file-name.builder';

export class ControllerGenerator implements Generator {
  private templatePath: string = '../../assets/ts/controller/controller.ts.template';
  private testTemplatePath: string = '../../assets/ts/controller/controller.spec.ts.template';

  public generate(name: string): Promise<void> {
    this.generateAsset(name);
    this.generateTestAsset(name);
    return Promise.resolve();
  }

  private generateAsset(name: string): void {
    const asset = {
      path: name,
      className: new ClassNameBuilder().addName(name).addAsset(AssetEnum.CONTROLLER).build(),
      filename: new FileNameBuilder().addName(name).addAsset(AssetEnum.CONTROLLER).addExtension('ts').build()
    };
    this.copy(asset);
  }

  private generateTestAsset(name: string): void {
    const asset = {
      path: name,
      className: new ClassNameBuilder().addName(name).addAsset(AssetEnum.CONTROLLER).build(),
      filename: new FileNameBuilder().addName(name).addAsset(AssetEnum.CONTROLLER).addTest(true).addExtension('ts').build(),
      importFilename: new FileNameBuilder().addName(name).addAsset(AssetEnum.CONTROLLER).addExtension('ts').build()
    };
    this.copy(asset, true);
  }

  private copy(asset: any, isTest: boolean = false) {
    const template: string = path.resolve(__dirname, isTest ? this.testTemplatePath : this.templatePath);
    const reader: Readable = fs.createReadStream(template);
    const writer: Writable = fs.createWriteStream(path.resolve(process.cwd(), asset.path, asset.filename));
    reader
      .pipe(new ReplaceTransform('[NAME]', asset.className))
      .pipe(new ReplaceTransform('[name]', asset.importFilename))
      .pipe(writer);
  }
}