// @flow
import React from 'react';

import type { Module, Directory, ModuleError } from 'common/types';

import { validateTitle } from 'app/store/entities/sandboxes/modules/validator';
import { isMainModule } from 'app/store/entities/sandboxes/modules/selectors';

import Entry from './Entry';
import DirectoryEntry from './';

type Props = {
  depth: number,
  renameModule: (id: string, title: string) => boolean,
  directories: Array<Directory>,
  modules: Array<Module>,
  openMenu: (event: Event) => any,
  sandboxId: string,
  deleteEntry: (id: string) => any,
  setCurrentModule: (id: string) => any,
  currentModuleId: ?string,
  parentShortid: string,
  errors: Array<ModuleError>,
  isInProjectView: boolean,
  parentShortid: string,
};

export default class DirectoryChildren extends React.PureComponent {
  props: Props;

  validateTitle = (id: string, title: string) => {
    const { directories, modules } = this.props;
    return !!validateTitle(id, title, [...directories, ...modules]);
  };

  render() {
    const {
      depth = 0,
      renameModule,
      openMenu,
      setCurrentModule,
      directories,
      parentShortid,
      sandboxId,
      modules,
      deleteEntry,
      currentModuleId,
      isInProjectView,
      errors,
    } = this.props;

    return (
      <div>
        {directories
          .filter(x => x.directoryShortid === parentShortid)
          .map(dir => (
            <DirectoryEntry
              key={dir.id}
              siblings={[...directories, ...modules]}
              depth={depth + 1}
              id={dir.id}
              shortid={dir.shortid}
              title={dir.title}
              sandboxId={sandboxId}
              modules={modules}
              directories={directories}
              currentModuleId={currentModuleId}
              isInProjectView={isInProjectView}
              errors={errors}
            />
          ))}
        {modules.filter(x => x.directoryShortid === parentShortid).map(m => {
          const isActive = m.id === currentModuleId;
          const mainModule = isMainModule(m);

          const hasError = !!errors.find(
            e => e.severity === 'error' && e.moduleId === m.id,
          );

          return (
            <Entry
              key={m.id}
              id={m.id}
              shortid={m.shortid}
              title={m.title}
              depth={depth + 1}
              active={isActive}
              type="function"
              rename={mainModule ? undefined : renameModule}
              openMenu={openMenu}
              deleteEntry={mainModule ? undefined : deleteEntry}
              isNotSynced={m.isNotSynced}
              renameValidator={this.validateTitle}
              setCurrentModule={setCurrentModule}
              isInProjectView={isInProjectView}
              isMainModule={mainModule}
              moduleHasError={hasError}
            />
          );
        })}
      </div>
    );
  }
}
