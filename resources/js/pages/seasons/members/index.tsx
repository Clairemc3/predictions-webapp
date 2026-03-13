import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import SeasonManageLayout from '../../../layouts/SeasonManageLayout';
import { MembersTab } from '../../../components/Season';
import { Season, Member } from '../../../types/season';

interface PageProps extends Record<string, any> {
  season: Season;
  seasonStatus: string;
  members: Member[];
  excludedMembers: Member[];
  excludedMembersCount: number;
  totalRequiredAnswers: number;
}

const MembersIndex = () => {
  const { 
    season, 
    seasonStatus, 
    members, 
    excludedMembers, 
    excludedMembersCount, 
    totalRequiredAnswers 
  } = usePage<PageProps>().props;
  
  const permissions = season.permissions;

  return (
    <>
      <Head title={`Members - ${season.name}`} />
      <SeasonManageLayout
        season={season}
        seasonStatus={seasonStatus}
        totalRequiredAnswers={totalRequiredAnswers}
        currentTab="members"
      >
        <MembersTab 
          members={members}
          excludedMembers={excludedMembers}
          excludedMembersCount={excludedMembersCount}
          seasonId={season.id} 
          totalRequiredAnswers={totalRequiredAnswers} 
          canInviteMembers={permissions.canInviteMembers} 
        />
      </SeasonManageLayout>
    </>
  );
};

export default MembersIndex;
