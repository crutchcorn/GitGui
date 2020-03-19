import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Commit} from './Commit';

/**
 * In order to cache the "push"/"pull" metadata for local branches, we need
 * to store metadata (such as commits returned from `git.log({ref: 'origin/branchName'})`)
 * and store them in our database. As such, be cognizant when doing a base `query` to filter
 * based on the `isLocal` flag
 */
@Entity()
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * While I'd love to  set `{unique: true}`, we'd quickly run into issue when trying to use
   * `trackedBranch` with the same name. Furthermore, we'd also have issues with other repos.
   * Keep in mind that this is the table for ALL branches and different repos will have the same
   * branch associated.
   */
  @Column({type: 'text'})
  name: string;

  @ManyToMany(type => Commit, {cascade: ['insert']})
  @JoinTable()
  commits: Commit[];

  /**
   * This should always be `true` unless it's a remote branch cached for metadata purposes
   */
  @Column({type: 'boolean'})
  isLocal: boolean;

  // If `isLocal` is true, this should have a value. Otherwise, this should have no value
  @OneToOne(type => Branch, {nullable: true, cascade: ['insert']})
  @JoinColumn()
  trackedBranch?: Branch;

  // If `isLocal` is false, this should have a value. Otherwise, this should have no value
  @Column('text', {nullable: true})
  associatedRemote?: string;
}
